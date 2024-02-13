import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { Todo } from "../../../models/todos/Todo.model";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  FormLabel,
} from "@mui/material";
import TodoApi from "../../../app/api/todo/Todo.api";
import React from "react";

interface ModalFormProps {
  setModalOpen: (isOpen: boolean) => void;
  onTodoCreated: () => void;
  editMode?: boolean;
  initialData?: Todo | null;
}

const ModalForm: React.FC<ModalFormProps> = ({
  setModalOpen,
  onTodoCreated,
  editMode = false,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<Todo>();

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatString = (date: string) => {
    return date.split("T")[0];
  }

  useEffect(() => {
    if (editMode && initialData) {
      // Populate the form fields with initialData
      reset({
        id: initialData.id,
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority || 'low' // Ensure priority is being set
        // Other fields as needed
      });
  
      // Set additional component state as needed for dates or other fields
      setTaskData({
        startDateTime: formatString(initialData.startDate), // Make sure the format matches your input field's expected format
        dueDateTime: formatString(initialData.endDate), // Same as above regarding format
      });
    } else {
      reset();
    }
  }, [editMode, initialData, reset]);

  const today = new Date().toISOString().split("T")[0];

  

  const [taskData, setTaskData] = useState({
    startDateTime: formatDate(new Date()), // Today's date as the default start date
    dueDateTime: "", // Empty initially
  });

  useEffect(() => {
    // Ensure the end date is not before the start date
    if (taskData.dueDateTime && taskData.startDateTime > taskData.dueDateTime) {
      setTaskData({ ...taskData, dueDateTime: taskData.startDateTime });
    }
  }, [taskData.startDateTime]);

  // Handler to update state on input change
  const handleChange = (value: string, fieldName: string) => {
    setTaskData({
      ...taskData,
      [fieldName]: value,
    });
  };

  const onSubmit: SubmitHandler<Todo> = async (data) => {
    try {
      if (editMode && initialData) {
        await TodoApi.update(data); // Assuming you have an update method
      } else {
        await TodoApi.create(data);
      }
      reset();
      setModalOpen(false);
      onTodoCreated(); // This should refresh the list whether it's create or update
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modalWindow">
      <form onSubmit={handleSubmit(onSubmit)} className="modalWindow__form">
        <TextField
          fullWidth
          placeholder="Title"
          {...register("title", { required: true })}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Description"
          {...register("description", { required: true })}
        />
        <FormControl fullWidth>
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            label="Priority"
            {...register("priority", { required: true })}
            value={watch("priority")}
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <div className="modalWindow__date">
          <div className="modalWindow__date__inner">
            <FormLabel>Start Date</FormLabel>
            <TextField
              {...register("startDate", { required: true })}
              placeholder="Start Date"
              type="date"
              sx={{ display: "flex" }}
              value={taskData.startDateTime}
              onChange={(e) => handleChange(e.target.value, "startDateTime")}
              InputProps={{
                inputProps: {
                  min: today,
                  max: taskData.dueDateTime,
                },
              }}
            />
          </div>
          <div className="modalWindow__date__inner">
            <FormLabel>End Date</FormLabel>
            <TextField
              {...register("endDate", { required: true })}
              type="date"
              sx={{ display: "flex" }}
              value={taskData.dueDateTime}
              onChange={(e) => handleChange(e.target.value, "dueDateTime")}
              InputProps={{
                inputProps: {
                  min:
                    taskData.startDateTime === ""
                      ? today
                      : taskData.startDateTime,
                },
              }}
            />
          </div>
        </div>
        <div className="modalWindow__buttons">
          <Button type="submit" variant="contained">
            {editMode ? "Update" : "Create"}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (editMode && initialData) {
                reset(initialData);
              }
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModalForm;

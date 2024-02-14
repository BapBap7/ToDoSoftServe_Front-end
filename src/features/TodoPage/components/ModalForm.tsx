import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
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
  Typography,
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
    watch,
  } = useForm<Todo>();

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatString = (date: string) => {
    return date.split("T")[0];
  };

  const priorityValue = watch("priority") || "";

  useEffect(() => {
    if (editMode && initialData) {
      reset({
        id: initialData.id,
        title: initialData.title,
        priority: initialData.priority,
        description: initialData.description,
        status: initialData.status,
      });

      setTaskData({
        startDateTime: formatString(initialData.startDate),
        dueDateTime: formatString(initialData.endDate),
      });
    } else {
      reset();
    }
  }, [editMode, initialData, reset]);

  const today = new Date().toISOString().split("T")[0];

  const [taskData, setTaskData] = useState({
    startDateTime: formatDate(new Date()),
    dueDateTime: "",
  });

  useEffect(() => {
    if (taskData.dueDateTime && taskData.startDateTime > taskData.dueDateTime) {
      setTaskData({ ...taskData, dueDateTime: taskData.startDateTime });
    }
  }, [taskData.startDateTime]);

  const handleChange = (value: string, fieldName: string) => {
    setTaskData({
      ...taskData,
      [fieldName]: value,
    });
  };

  const onSubmit: SubmitHandler<Todo> = async (data) => {
    try {
      if (editMode && initialData) {
        await TodoApi.update(data);
      } else {
        await TodoApi.create(data);
      }
      reset();
      setModalOpen(false);
      onTodoCreated();
    } catch (error) {
      console.log(error);
    }
  };

  //new

  return (
    <div className="modalWindow">
      <form onSubmit={handleSubmit(onSubmit)} className="modalWindow__form">
        <TextField
          fullWidth
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
        />
        <Typography color="error">
          <ErrorMessage errors={errors} name="title" />
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
        />
        <Typography color="error">
          <ErrorMessage errors={errors} name="description" />
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            label="Priority"
            {...register("priority", { required: "Priority is required" })}
            value={priorityValue}
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <Typography color="error">
          <ErrorMessage errors={errors} name="priority" />
        </Typography>
        <div className="modalWindow__date">
          <div className="modalWindow__date__inner">
            <FormLabel>Start Date</FormLabel>
            <TextField
              {...register("startDate", { required: "Start date is required" })}
              placeholder="Start Date"
              type="date"
              sx={{ display: "flex" }}
              value={taskData.startDateTime}
              onChange={(e) => handleChange(e.target.value, "startDateTime")}
              InputProps={{
                inputProps: {
                  max: taskData.dueDateTime,
                },
              }}
            />
            <Typography color="error">
              <ErrorMessage errors={errors} name="startDate" />
            </Typography>
          </div>
          <div className="modalWindow__date__inner">
            <FormLabel>End Date</FormLabel>
            <TextField
              {...register("endDate", { required: "End date is required" })}
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
            <Typography color="error">
              <ErrorMessage errors={errors} name="endDate" />
            </Typography>
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

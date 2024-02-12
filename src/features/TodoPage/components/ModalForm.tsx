import {useForm, SubmitHandler} from "react-hook-form"
import {Todo} from "../../../models/todos/Todo.model";
import Input from '@mui/joy/Input';
import {FormControl, InputLabel, Select, MenuItem, Button, TextField, FormLabel} from "@mui/material";
import TodoApi from "../../../app/api/todo/Todo.api";
import React from "react";

interface ModalFormProps {
    setModalOpen: (isOpen: boolean) => void; // Correctly type the setModalOpen function
}

const ModalForm: React.FC<ModalFormProps> = ({setModalOpen}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<Todo>()
    const onSubmit: SubmitHandler<Todo> = async (data) => {
        try {
            await TodoApi.create(data);
            reset();
            setModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="modalWindow">
            <form onSubmit={handleSubmit(onSubmit)} className="modalWindow__form">
                <TextField fullWidth placeholder="Title" {...register("title", {required: true})}/>
                <TextField fullWidth multiline rows={3}
                           placeholder="Description" {...register("description", {required: true})}/>
                <FormControl fullWidth>
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                        labelId="priority-label"
                        label="Priority"
                        {...register("priority", {required: true})}
                    >
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                    </Select>
                </FormControl>
                <div className="modalWindow__date">
                    <div className="modalWindow__date__inner">
                        <FormLabel>Start Date</FormLabel>
                        <Input
                               placeholder="Start Date"
                               type="date"
                               sx={{padding: 1.5}}
                        />
                    </div>
                    <div className="modalWindow__date__inner">
                        <FormLabel>End Date</FormLabel>
                        <Input
                               type="date"
                               sx={{padding: 1.5}}
                        />
                    </div>
                </div>
                <div className="modalWindow__buttons">
                    <Button type="submit" variant="contained">Create</Button>
                    <Button variant="contained" color="error" onClick={() => {
                        setModalOpen(false)
                    }}>Cancel</Button>
                </div>
            </form>


        </div>
    )
}

export default ModalForm;
import { Button, Typography } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { Todo } from "../../models/todos/Todo.model";
import TodoApi from "../../app/api/todo/Todo.api";
import "./Todo.component.css";
import ModalForm from "./components/ModalForm";
import {statusEnumType, statusReverseEnumType} from './enums/StatusEnum'
import { colorEnumType } from "./enums/PriorityColor";

const TodoComponent = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();

  const changeTodoStatus = async (todoId: number, newStatus: number) => {
    try {
      await TodoApi.changeStatus(todoId, newStatus);
      fetchTodos();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const fetchTodos = await TodoApi.getAll();
      setTodos(fetchTodos);
    } catch (error) {
      console.log("Failed to fetch todos: ", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await TodoApi.deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.log("Failed to delete todo: ", error);
    }
  };

  const dateParser = (date: string) => {
    const updatedDate = date.split("T");
    return updatedDate[0];
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const openEditModal = (todo: Todo) => {
    setSelectedTodo(todo); // Set the selected todo for editing
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedTodo(undefined); // Clear the selected todo
    setModalOpen(true); // Open the modal
  };

  return (
    <>
      {modalOpen && (
        <div className="modalBackdrop">
          <ModalForm
            setModalOpen={setModalOpen}
            onTodoCreated={fetchTodos}
            editMode={!!selectedTodo}
            initialData={selectedTodo}
          ></ModalForm>
        </div>
      )}
      <div className={`${modalOpen ? "contentDimmed" : ""}`}>
        <div className="navbar">
          <Button onClick={openCreateModal}>Create Todo</Button>
        </div>
        <div className="todoWrapper">
          <div className="todoCard">
            {todos.map((todo) => (
              <div key={todo.id} className="todoWrap">
                <div>
                  <Typography sx={{ fontWeight: 800, fontSize: 20 }}>
                    {todo.title}
                  </Typography>
                  <Typography className="todoDescription">
                    {todo.description}
                  </Typography>
                  <Typography>
                    {dateParser(todo.startDate)} - {dateParser(todo.endDate)}
                  </Typography>
                  <Typography>
                    Priority:{" "}
                    <span style={{ color: colorEnumType[todo.priority] }}>
                      {todo.priority}
                    </span>{" "}
                  </Typography>
                </div>
                <div className="todoCard__buttons">
                  <Button
                    variant="outlined"
                    onClick={() => openEditModal(todo)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => deleteTodo(todo.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </div>
                <div>
                  <Select
                    color="primary"
                    value={statusEnumType[todo.status]}
                    onChange={(e) => {
                      changeTodoStatus(
                        todo.id,
                        statusReverseEnumType[e.target.value]
                      );
                    }}
                  >
                    <MenuItem value="Todo">Todo</MenuItem>
                    <MenuItem value="InProgress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoComponent;

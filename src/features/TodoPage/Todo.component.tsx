import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Todo } from "../../models/todos/Todo.model";
import TodoApi from "../../app/api/todo/Todo.api";
import "./Todo.component.css";
import ModalForm from "./components/ModalForm";

const TodoComponent = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
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

  const dateParser = (date: string) => {
    const updatedDate = date.split("T");
    return updatedDate[0];
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async (id: number) => {
    try {
      await TodoApi.deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.log("Failed to delete todo: ", error);
    }
  };

  const handleTodoCreated = () => {
    fetchTodos();
  };

  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined); // Use undefined instead of null

  const openEditModal = (todo: Todo) => {
    setSelectedTodo(todo); // Set the selected todo for editing
    console.log(todo)
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
            onTodoCreated={handleTodoCreated}
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
          <div className="left">
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
                      <span style={{ color: getPriorityColor(todo.priority) }}>
                        {todo.priority}
                      </span>{" "}
                    </Typography>
                  </div>
                  <div className="todoCard__buttons">
                    <Button variant="outlined" onClick={() => openEditModal(todo)}>View</Button>
                    <Button
                      variant="outlined"
                      onClick={() => deleteTodo(todo.id)}
                      color="error"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoComponent;

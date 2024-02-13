import { Button, Typography } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { Todo } from "../../models/todos/Todo.model";
import TodoApi from "../../app/api/todo/Todo.api";
import "./Todo.component.css";
import ModalForm from "./components/ModalForm";

type StatusEnumType = {
  [key: number]: string;
};

type StatusReverseEnumType = {
  [key: string]: number;
};

const TodoComponent = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();

  const StatusEnum: StatusEnumType = {
    0: "Todo",
    1: "InProgress",
    2: "Done",
  };

  const StatusReverseEnumType: StatusReverseEnumType = {
    Todo: 0,
    InProgress: 1,
    Done: 2,
  };

  const changeTodoStatus = async (todoId: number, newStatus: number) => {
    try {
      await TodoApi.changeStatus(todoId, newStatus);
      // Update the todos array with the new status
      fetchTodos();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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

  //
  // When i click on view and editing it sets todo.status to Todo fix
  //

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
                    value={StatusEnum[todo.status]}
                    onChange={(e) => {
                      changeTodoStatus(
                        todo.id,
                        StatusReverseEnumType[e.target.value]
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

import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import {Todo} from "../../models/todos/Todo.model";
import TodoApi from "../../app/api/todo/Todo.api";
import "./Todo.component.css"
import ModalForm from "./components/ModalForm";


const TodoComponent = () => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const fetchTodos = async () => {
        try {
            const fetchTodos = await TodoApi.getAll();
            setTodos(fetchTodos);
        } catch (error) {
            console.log("Failed to fetch todos: ", error);
        }
    }

    useEffect(() => {
        fetchTodos();
    }, [])

    const deleteTodo = async (id: number) => {
        try {
            await TodoApi.deleteTodo(id);
            fetchTodos();
        } catch (error){
            console.log("Failed to delete todo: ", error)
        }
    }

    return (
        <>
            {modalOpen && (
                <div className="modalBackdrop">
                    <ModalForm setModalOpen={setModalOpen}></ModalForm>
                </div>
            )}
            <div className={modalOpen ? 'contentDimmed' : ''}>
                {todos.map((todo) => (
                    <div key={todo.id} className="todoWrap">
                        {todo.title}
                        <Button onClick={() => deleteTodo(todo.id)}>
                            Delete
                        </Button>
                    </div>
                ))}
                <Button onClick={() => setModalOpen(true)}>
                    Create Todo
                </Button>
            </div>
        </>
    )
}


export default TodoComponent;
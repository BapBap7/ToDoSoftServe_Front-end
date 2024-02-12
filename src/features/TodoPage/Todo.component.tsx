import {Box} from "@mui/material";
import {useEffect, useState} from "react";
import {Todo} from "../../models/todos/Todo.model";
import TodoApi from "../../app/api/todo/Todo.api";


const TodoComponent = () => {

    const [todos, setTodos] = useState<Todo[]>([]);
    useEffect(()=>{
        const fetchTodos = async () =>{
            try{
                const fetchTodos = await TodoApi.getAll();
                setTodos(fetchTodos);
            }catch(error){
                console.log("Failed to fetch todos: ", error);
            }
        }
        fetchTodos();
    },[])


    return (
        <>
            <Box>
                {todos.map((todo) => (
                    <div key={todo.id}>
                        {todo.title}
                    </div>
                ))}
            </Box>
        </>
    )
}


export default TodoComponent;
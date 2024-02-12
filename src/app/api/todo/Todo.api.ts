import Agent from '../agent.api';
import {Todo} from "../../../models/todos/Todo.model";
import {API_ROUTES} from "../../../common/constants/api-routes.constants";

const TodoApi = {
    getAll: () => Agent.get<Todo[]>(API_ROUTES.TODOS.GET_ALL),
    getById: (id: number) => Agent.get<Todo>(`API_ROUTES.TODOS.GET/${id}`),
    deleteTodo: (id: number) => Agent.delete<number>(`API_ROUTES.TODOS.DELETE/${id}`),
    create: (todo: Todo) => Agent.post<Todo>(API_ROUTES.TODOS.CREATE, todo),
    update: (todo: Todo) => Agent.put<Todo>(API_ROUTES.TODOS.UPDATE, todo),
    changeStatus: (id: number, status: number) => Agent.put<number>(`${API_ROUTES.TODOS.CHANGE_STATUS}`, { id, status })
}

export default TodoApi;
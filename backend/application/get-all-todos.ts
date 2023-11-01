import { TodoRepository } from "../domain/todo.js";
import { TodoTO } from "./types.js";

export type GetAllTodos = () => Array<TodoTO>;
export function initGetAllTodos(todoRepository: TodoRepository): GetAllTodos {
    return () =>
        todoRepository.getAll().map(({ id, description, done }) => ({ id, description, done }));
}

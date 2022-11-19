import { TodoRepository } from "../domain/todo";
import { TodoTO } from "./types";

export type GetAllTodos = () => Array<TodoTO>;
export function initGetAllTodos(todoRepository: TodoRepository): GetAllTodos {
    return () =>
        todoRepository.getAll().map(({ id, description, done }) => ({ id, description, done }));
}

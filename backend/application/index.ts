import { TodoRepository } from "../domain/todo";
import { initCreateTodo } from "./create-todo";
import { initGetAllTodos } from "./get-all-todos";
import { initGetTodo } from "./get-todo";
import { initMarkTodoStatus } from "./mark-todo-status";
import { initRemoveTodo } from "./remove-todo";

export function initUseCases(todoRepository: TodoRepository) {
    return {
        createTodo: initCreateTodo(todoRepository),
        getAllTodos: initGetAllTodos(todoRepository),
        getTodo: initGetTodo(todoRepository),
        markTodoStatus: initMarkTodoStatus(todoRepository),
        removeTodo: initRemoveTodo(todoRepository),
    };
}
export type UseCases = ReturnType<typeof initUseCases>;

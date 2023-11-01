import { TodoRepository } from "../domain/todo.js";
import { initCreateTodo } from "./create-todo.js";
import { initGetAllTodos } from "./get-all-todos.js";
import { initGetTodo } from "./get-todo.js";
import { initMarkTodoStatus } from "./mark-todo-status.js";
import { initRemoveTodo } from "./remove-todo.js";

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

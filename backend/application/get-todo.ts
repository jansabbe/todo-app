import { TodoRepository } from "../domain/todo.js";
import { UseCase, TodoTO, Maybe, ErrorCode } from "./types.js";

export type GetTodo = UseCase<{ id: string }, Maybe<TodoTO>>;
export function initGetTodo(todoRepository: TodoRepository): GetTodo {
    return (command) => {
        const todo = todoRepository.findById(command.id);
        if (!todo) {
            return {
                status: "ERROR",
                code: ErrorCode.TodoNotFound,
                errorMessage: "Could not find todo",
            };
        }
        const { id, description, done } = todo;
        return { status: "OK", result: { id, description, done } };
    };
}

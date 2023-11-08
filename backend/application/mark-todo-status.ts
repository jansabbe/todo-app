import { TodoRepository } from "../domain/todo.js";
import { UseCase, Maybe, ErrorCode } from "./types.js";

export type MarkTodoStatus = UseCase<{ id: string; done: boolean }, Maybe<{}>>;
export function initMarkTodoStatus(todoRepository: TodoRepository): MarkTodoStatus {
    return ({ id, done }) => {
        const todo = todoRepository.findById(id);
        if (!todo) {
            return {
                status: "ERROR",
                code: ErrorCode.TodoNotFound,
                errorMessage: "Could not find todo",
            };
        }
        todoRepository.save({ ...todo, done });
        return { status: "OK", result: {} };
    };
}

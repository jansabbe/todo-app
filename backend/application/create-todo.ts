import { randomUUID } from "crypto";
import { TodoRepository } from "../domain/todo.js";
import { UseCase, TodoTO, Maybe, ErrorCode, ok, error } from "./types.js";

export type CreateTodo = UseCase<{ description: string }, Maybe<TodoTO>>;

export function initCreateTodo(todoRepository: TodoRepository): CreateTodo {
    return (command) => {
        const description = command.description.trim();
        if (description.length === 0) {
            return error(ErrorCode.DescriptionNotFilledIn, "Description cannot be empty");
        }
        if (description.length > 100) {
            return error(
                ErrorCode.DescriptionTooLong,
                "Description may not be more than 100 characters",
            );
        }

        const newTodo = { id: randomUUID(), description, done: false };
        todoRepository.save(newTodo);

        return ok({
            id: newTodo.id,
            description: newTodo.description,
            done: newTodo.done,
        });
    };
}

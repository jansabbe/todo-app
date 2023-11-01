import { TodoRepository } from "../domain/todo.js";
import { UseCase } from "./types.js";

export type RemoveTodo = UseCase<{ id: string }, void>;
export function initRemoveTodo(todoRepository: TodoRepository): RemoveTodo {
    return (command) => {
        todoRepository.remove(command.id);
    };
}

import { TodoRepository } from "../domain/todo";
import { UseCase } from "./types";

export type RemoveTodo = UseCase<{ id: string }, void>;
export function initRemoveTodo(todoRepository: TodoRepository): RemoveTodo {
    return (command) => {
        todoRepository.remove(command.id);
    };
}

import { randomUUID } from "crypto";
import { TodoRepository } from "../domain/todo.js";
import { InMemoryTodoRepository } from "../infrastructure/outgoing.js";
import { GetTodo, initGetTodo } from "./get-todo.js";
import { ErrorCode } from "./types.js";

describe("Get Todo", () => {
    let getTodo: GetTodo;
    let todoRepository: TodoRepository;

    beforeEach(() => {
        todoRepository = new InMemoryTodoRepository();
        getTodo = initGetTodo(todoRepository);
    });

    test("returns saved todo with given id", () => {
        const todo = { id: "1", description: "First", done: false };
        todoRepository.save(todo);
        todoRepository.save({ id: "2", description: "Second", done: false });

        expect(getTodo({ id: todo.id })).toEqual({ status: "OK", result: todo });
    });

    test("returns an error when no todo found", () => {
        expect(getTodo({ id: randomUUID() })).toEqual({
            status: "ERROR",
            code: ErrorCode.TodoNotFound,
            errorMessage: "Could not find todo",
        });
    });
});

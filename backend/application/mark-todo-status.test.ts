import { TodoRepository } from "../domain/todo.js";
import { InMemoryTodoRepository } from "../infrastructure/outgoing.js";
import { MarkTodoStatus, initMarkTodoStatus } from "./mark-todo-status.js";
import { ErrorCode } from "./types.js";

describe("Mark Todo Status", () => {
    let markTodoStatus: MarkTodoStatus;
    let todoRepository: TodoRepository;

    beforeEach(() => {
        todoRepository = new InMemoryTodoRepository();
        markTodoStatus = initMarkTodoStatus(todoRepository);
    });

    test("can mark todo as done", () => {
        todoRepository.save({ id: "1", description: "do something", done: false });
        const result = markTodoStatus({ id: "1", done: true });
        expect(todoRepository.findById("1")).toMatchObject({ done: true });
        expect(result).toMatchObject({ status: "OK" });
    });

    test("can mark todo as todo", () => {
        todoRepository.save({ id: "1", description: "do something", done: true });
        const result = markTodoStatus({ id: "1", done: false });
        expect(todoRepository.findById("1")).toMatchObject({ done: false });
        expect(result).toMatchObject({ status: "OK" });
    });

    test("gives error when todo not found", () => {
        const result = markTodoStatus({ id: "1", done: false });
        expect(result).toEqual({
            status: "ERROR",
            code: ErrorCode.TodoNotFound,
            errorMessage: "Could not find todo",
        });
    });
});

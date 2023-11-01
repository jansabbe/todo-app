import { TodoRepository } from "../domain/todo.js";
import { InMemoryTodoRepository } from "../infrastructure/outgoing.js";
import { CreateTodo, initCreateTodo } from "./create-todo.js";
import { ErrorCode } from "./types.js";

describe("Create Todo", () => {
    let createTodo: CreateTodo;
    let todoRepository: TodoRepository;

    beforeEach(() => {
        todoRepository = new InMemoryTodoRepository();
        createTodo = initCreateTodo(todoRepository);
    });

    test("creates a new todo", () => {
        const response = createTodo({ description: "go to gym" });

        expect(response).toEqual({
            status: "OK",
            result: { id: expect.any(String), description: "go to gym", done: false },
        });

        expect(todoRepository.getAll()).toEqual([
            { id: expect.any(String), description: "go to gym", done: false },
        ]);
    });

    test.each(["", "  ", "\t"])(
        "cannot create a todo with empty description ('%s')",
        (description) => {
            const response = createTodo({ description });

            expect(response).toEqual({
                status: "ERROR",
                code: ErrorCode.DescriptionNotFilledIn,
                errorMessage: "Description cannot be empty",
            });

            expect(todoRepository.getAll()).toEqual([]);
        },
    );

    test("can create a todo with a description with 100 characters", () => {
        const description = [...Array(100)].map(() => "x").join("");
        const response = createTodo({ description });

        expect(response).toMatchObject({ status: "OK" });
        expect(todoRepository.getAll().length).toEqual(1);
    });

    test("cannot create a todo with a description with more than 100 characters", () => {
        const description = [...Array(101)].map(() => "x").join("");
        const response = createTodo({ description });

        expect(response).toEqual({
            status: "ERROR",
            code: ErrorCode.DescriptionTooLong,
            errorMessage: "Description may not be more than 100 characters",
        });

        expect(todoRepository.getAll()).toEqual([]);
    });
});

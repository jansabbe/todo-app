import express from "express";
import { Server } from "http";
import { routes } from "./incoming";
import axios, { AxiosInstance } from "axios";
import { randomUUID } from "crypto";
import { UseCases } from "../application";
import { ErrorCode } from "../application/types";

type MockedUseCases = {
    [K in keyof UseCases]: jest.Mock<ReturnType<UseCases[K]>, Parameters<UseCases[K]>>;
};

describe("REST api", () => {
    let server: Server;
    let client: AxiosInstance;
    let useCases: MockedUseCases;

    beforeEach(() => {
        useCases = {
            createTodo: jest.fn(),
            getAllTodos: jest.fn(),
            getTodo: jest.fn(),
            markTodoStatus: jest.fn(),
            removeTodo: jest.fn(),
        };

        server = express()
            .use((req, res, next) => {
                req.context = { useCases };
                next();
            })
            .use(routes)
            .listen();
        client = axios.create({
            baseURL: `http://localhost:${(server.address() as any).port}/`,
        });
    });

    afterEach((done) => {
        server.close(done);
    });

    test("GET /api/todos calls getAllTodos", async () => {
        const todos = [
            aTodo({ description: "Get groceries" }),
            aTodo({ description: "Go running", done: true }),
        ];
        useCases.getAllTodos.mockReturnValue(todos);

        const call = client.get("/api/todos");

        await expect(call).resolves.toMatchObject({
            status: 200,
            data: todos,
        });
    });

    test("GET /api/todos/:id calls getTodo", async () => {
        const todo = aTodo({ description: "Get groceries" });
        useCases.getTodo.mockReturnValue({
            status: "OK",
            result: todo,
        });

        const call = client.get(`/api/todos/${todo.id}`);

        await expect(call).resolves.toMatchObject({
            status: 200,
            data: todo,
        });
        expect(useCases.getTodo).toHaveBeenCalledWith({ id: todo.id });
    });

    test("GET /api/todos/:id returns 404 if getTodo fails", async () => {
        useCases.getTodo.mockReturnValue({
            status: "ERROR",
            code: ErrorCode.TodoNotFound,
            errorMessage: "Could not find todo",
        });

        const call = client.get(`/api/todos/1234`).catch((e) => e.response);

        await expect(call).resolves.toMatchObject({
            status: 404,
            data: {
                code: "todo_not_found",
                errorMessage: "Could not find todo",
            },
        });
    });

    test("POST /api/todos calls createTodo ", async () => {
        const expectedTodo = aTodo({ description: "Get groceries" });
        useCases.createTodo.mockReturnValue({
            status: "OK",
            result: expectedTodo,
        });

        const call = client.post("/api/todos", {
            description: expectedTodo.description,
        });

        await expect(call).resolves.toMatchObject({
            status: 200,
            data: expectedTodo,
        });
        expect(useCases.createTodo).toHaveBeenCalledWith({
            description: expectedTodo.description,
        });
    });

    test("POST /api/todos returns 400 if createTodo fails", async () => {
        useCases.createTodo.mockReturnValue({
            status: "ERROR",
            code: ErrorCode.DescriptionNotFilledIn,
            errorMessage: "You should fill in a description",
        });

        const call = client.post("/api/todos", { description: "" }).catch((e) => e.response);

        await expect(call).resolves.toMatchObject({
            status: 400,
            data: {
                code: ErrorCode.DescriptionNotFilledIn,
                errorMessage: "You should fill in a description",
            },
        });
    });

    test("PUT /api/todos/:id/status calls markTodoStatus", async () => {
        useCases.markTodoStatus.mockReturnValue({ status: "OK", result: {} });
        const id = randomUUID();
        const call = client.put(`/api/todos/${id}/status`, { done: true });

        await expect(call).resolves.toMatchObject({
            status: 200,
            data: {},
        });
        expect(useCases.markTodoStatus).toHaveBeenCalledWith({ id, done: true });
    });

    test("PUT /api/todos/:id/status returns 404 if markTodoStatus fails", async () => {
        useCases.markTodoStatus.mockReturnValue({
            status: "ERROR",
            code: ErrorCode.TodoNotFound,
            errorMessage: "Could not find todo",
        });

        const call = client.put("/api/todos/1323/status", { done: true }).catch((e) => e.response);

        await expect(call).resolves.toMatchObject({
            status: 404,
            data: {
                code: ErrorCode.TodoNotFound,
                errorMessage: "Could not find todo",
            },
        });
    });

    test("DELETE /api/todos/:id calls removeTodo", async () => {
        const id = randomUUID();
        const call = client.delete(`/api/todos/${id}`);

        await expect(call).resolves.toMatchObject({ status: 200, data: {} });
        expect(useCases.removeTodo).toHaveBeenCalledWith({ id });
    });

    test.todo("only accept put/post requests that match a JSON schema");
});

function aTodo(overrides: Partial<{ id: string; description: string; done: boolean }> = {}) {
    return {
        id: randomUUID(),
        description: randomUUID(),
        done: false,
        ...overrides,
    };
}

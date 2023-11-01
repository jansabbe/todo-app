import { routes } from "./incoming.js";
import axios, { AxiosInstance } from "axios";
import { randomUUID } from "crypto";
import { UseCases } from "../application/index.js";
import { ErrorCode } from "../application/types.js";
import { Mock, vi } from "vitest";
import fastify, { FastifyInstance } from "fastify";

type MockedUseCases = {
    [K in keyof UseCases]: Mock<Parameters<UseCases[K]>, ReturnType<UseCases[K]>>;
};

describe("REST api", () => {
    let app: FastifyInstance;
    let client: AxiosInstance;
    let useCases: MockedUseCases;

    beforeEach(async () => {
        useCases = {
            createTodo: vi.fn(),
            getAllTodos: vi.fn(),
            getTodo: vi.fn(),
            markTodoStatus: vi.fn(),
            removeTodo: vi.fn(),
        };

        app = fastify();
        app.decorate("useCases", useCases);
        app.register(routes);
        await app.listen();

        client = axios.create({
            baseURL: `http://localhost:${app.addresses()[0].port}/`,
        });
    });

    afterEach(async () => {
        await app.close();
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

    test("PUT /api/todos/:id/status returns 400 if body does not contain required properties", async () => {
        const call = client.put("/api/todos/1323/status", {}).catch((e) => e.response);

        await expect(call).resolves.toMatchObject({
            status: 400,
            data: {
                code: "FST_ERR_VALIDATION",
                errorMessage: "body must have required property 'done'",
            },
        });
    });

    test("DELETE /api/todos/:id calls removeTodo", async () => {
        const id = randomUUID();
        const call = client.delete(`/api/todos/${id}`);

        await expect(call).resolves.toMatchObject({ status: 200, data: {} });
        expect(useCases.removeTodo).toHaveBeenCalledWith({ id });
    });
});

function aTodo(overrides: Partial<{ id: string; description: string; done: boolean }> = {}) {
    return {
        id: randomUUID(),
        description: randomUUID(),
        done: false,
        ...overrides,
    };
}

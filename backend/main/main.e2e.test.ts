import axios, { AxiosInstance } from "axios";
import express from "express";
import { Server } from "http";
import { dependencyInjection } from "./dependency-injection";
import { routes } from "../infrastructure/incoming";

describe("E2E happy flow", () => {
    const todoDescription = "Get some groceries";
    let server: Server;
    let client: AxiosInstance;

    beforeAll(() => {
        server = express().use(dependencyInjection).use(routes).listen();
        client = axios.create({
            baseURL: `http://localhost:${(server.address() as any).port}/`,
        });
    });

    afterAll((done) => {
        server.close(done);
    });

    it("1 - start with no todos", async () => {
        await expect(getAllTodos()).resolves.toEqual([]);
    });

    it("2 - add a new todo", async () => {
        const result = await createTodo({ description: todoDescription });

        expect(result).toEqual({
            id: expect.any(String),
            description: todoDescription,
            done: false,
        });
    });

    it("3 - mark todo as done", async () => {
        const [{ id }] = await getAllTodos();

        await markAsDone({ id });

        await expect(getTodo({ id })).resolves.toEqual({
            id,
            done: true,
            description: todoDescription,
        });
    });

    it("4 - remove todo", async () => {
        const [{ id }] = await getAllTodos();

        await removeTodo({ id });

        await expect(getAllTodos()).resolves.toEqual([]);
    });

    const getAllTodos = () =>
        client
            .get("/api/todos")
            .then((response) => response.data)
            .catch((e) => e.response);

    const createTodo = ({ description }: { description: string }) =>
        client
            .post("/api/todos", { description })
            .then((response) => response.data)
            .catch((e) => e.response);

    const markAsDone = ({ id }: { id: string }) =>
        client.put(`/api/todos/${id}/status`, { done: true }).catch((e) => e.response);

    const getTodo = ({ id }: { id: string }) =>
        client
            .get(`/api/todos/${id}`)
            .then((response) => response.data)
            .catch((e) => e.response);

    const removeTodo = ({ id }: { id: string }) =>
        client.delete(`/api/todos/${id}`).catch((e) => e.response);
});

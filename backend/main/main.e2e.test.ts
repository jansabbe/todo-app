import axios, { AxiosInstance } from "axios";
import { dependencyInjection } from "./dependency-injection.js";
import { routes } from "../infrastructure/incoming.js";
import fastify, { FastifyInstance } from "fastify";

describe("E2E happy flow", () => {
    const todoDescription = "Get some groceries";
    let app: FastifyInstance;
    let client: AxiosInstance;

    beforeAll(async () => {
        app = fastify();
        await app.register(dependencyInjection, { routes }).listen();

        client = axios.create({
            baseURL: `http://localhost:${app.addresses()[0].port}/`,
        });
    });

    afterAll(async () => {
        await app.close();
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

import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import { TodoTO } from "../lib/api";

let todos: Array<TodoTO> = [];

export function resetTodos(initialTodos: Array<TodoTO> = []) {
    todos = initialTodos;
}

export const mswServer = setupServer(
    http.get("/api/todos", () => {
        return HttpResponse.json(todos);
    }),

    http.put("/api/todos/:todoId/status", async ({ request, params }) => {
        const { todoId } = params;
        const { done } = (await request.json()) as { done: boolean };
        const foundTodo = todos.find((t) => t.id === todoId);
        if (foundTodo) {
            foundTodo.done = done;
        }
        return HttpResponse.json({});
    }),

    http.post("/api/todos", async ({ request }) => {
        const { description } = (await request.json()) as { description: string };
        const newTodo = { id: faker.string.uuid(), description, done: false };
        todos.push(newTodo);
        return HttpResponse.json(newTodo);
    }),
);

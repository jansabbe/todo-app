import { setupServer } from "msw/node";
import { rest } from "msw";
import { faker } from "@faker-js/faker";
import { TodoTO } from "../lib/api";

let todos: Array<TodoTO> = [];

export function resetTodos(initialTodos: Array<TodoTO> = []) {
    todos = initialTodos;
}

export const mswServer = setupServer(
    rest.get("/api/todos", (request, response, context) => {
        return response(context.json(todos));
    }),

    rest.put("/api/todos/:todoId/status", async (request, response, context) => {
        const { todoId } = request.params;
        const { done } = await request.json();
        todos = todos.map((todo) => {
            if (todo.id === todoId) {
                return { ...todo, done };
            }
            return todo;
        });
        return response(context.status(200));
    }),

    rest.post("/api/todos", async (request, response, context) => {
        const { description } = await request.json();
        const newTodo = { id: faker.datatype.uuid(), description, done: false };
        todos.push(newTodo);
        return response(context.json(newTodo));
    })
);

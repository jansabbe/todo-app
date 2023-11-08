import Fastify, {
    FastifyBaseLogger,
    FastifyInstance,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
} from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { ErrorCode } from "../application/types.js";

type FastifyJsonSchema = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    JsonSchemaToTsProvider
>;

const todoTOType = {
    type: "object",
    required: ["id", "description", "done"],
    properties: {
        id: { type: "string" },
        description: { type: "string" },
        done: { type: "boolean" },
    },
} as const;
const errorType = {
    type: "object",
    required: ["code", "errorMessage"],
    properties: {
        code: { type: "string" },
        errorMessage: { type: "string" },
    },
} as const;

export async function routes(app: FastifyJsonSchema) {
    app.route({
        method: "GET",
        url: "/api/todos",
        schema: {
            response: { 200: { type: "array", items: todoTOType } },
        },
        handler(request, reply) {
            reply.send(app.useCases.getAllTodos());
        },
    });

    app.route({
        method: "GET",
        url: "/api/todos/:id",
        schema: {
            params: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string" } },
            },
            response: {
                200: todoTOType,
                404: errorType,
            },
        },
        handler(request, reply) {
            const result = app.useCases.getTodo({ id: request.params.id });

            if (result.status === "OK") {
                reply.send(result.result);
            } else {
                reply.status(404).send({
                    code: result.code,
                    errorMessage: result.errorMessage,
                });
            }
        },
    });

    app.route({
        method: "POST",
        url: "/api/todos",
        schema: {
            body: {
                type: "object",
                required: ["description"],
                properties: {
                    description: { type: "string" },
                },
            },
            response: {
                200: todoTOType,
                400: errorType,
            },
        },
        handler(request, reply) {
            const { description } = request.body;
            const result = app.useCases.createTodo({ description });

            if (result.status === "OK") {
                reply.send(result.result);
            } else {
                reply.status(400).send({
                    code: result.code,
                    errorMessage: result.errorMessage,
                });
            }
        },
    });

    app.route({
        method: "PUT",
        url: "/api/todos/:id/status",
        schema: {
            params: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string" } },
            },
            body: {
                type: "object",
                required: ["done"],
                properties: { done: { type: "boolean" } },
            },
            response: {
                200: { type: "object", properties: {} },
                400: errorType,
            },
        },
        handler(request, reply) {
            const result = app.useCases.markTodoStatus({
                id: request.params.id,
                done: request.body.done,
            });
            if (result.status === "OK") {
                reply.send(result.result);
            } else {
                reply.status(result.code === ErrorCode.TodoNotFound ? 404 : 400).send({
                    code: result.code,
                    errorMessage: result.errorMessage,
                });
            }
        },
    });

    app.route({
        method: "DELETE",
        url: "/api/todos/:id",
        schema: {
            params: {
                type: "object",
                required: ["id"],
                properties: { id: { type: "string" } },
            },
            response: {
                200: { type: "object", properties: {} },
            },
        },
        handler(request, reply) {
            app.useCases.removeTodo({ id: request.params.id });
            return {};
        },
    });

    app.setErrorHandler((error, request, reply) => {
        if (error.statusCode === 400) {
            reply.status(error.statusCode).send({
                code: error.code,
                errorMessage: error.message,
            });
            return;
        }
        throw error;
    });
}

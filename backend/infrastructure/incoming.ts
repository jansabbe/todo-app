import bodyParser from "body-parser";
import { Response, Router } from "express";
import { ErrorCode, Maybe } from "../application/types";

const routes = Router();
routes.use(bodyParser.json());

routes.get("/api/todos", ({ context }, res) => {
    const { getAllTodos } = context.useCases;
    return res.json(getAllTodos());
});

routes.get("/api/todos/:id", ({ params, context }, res) => {
    const { getTodo } = context.useCases;
    const result = getTodo({ id: params.id });
    return mapMaybe(res, result);
});

routes.post("/api/todos", ({ body, context }, res) => {
    const { description } = body;
    const { createTodo } = context.useCases;
    const result = createTodo({ description });
    return mapMaybe(res, result);
});

routes.put("/api/todos/:id/status", ({ params, body, context }, res) => {
    const { done } = body;
    const { markTodoStatus } = context.useCases;
    const result = markTodoStatus({ id: params.id, done });
    return mapMaybe(res, result);
});

routes.delete("/api/todos/:id", ({ params, context }, res) => {
    const { removeTodo } = context.useCases;
    removeTodo({ id: params.id });
    return res.json({});
});

function mapMaybe(res: Response, result: Maybe<any>): Response {
    if (result.status === "OK") {
        return res.json(result.result);
    } else {
        return res
            .status(result.code === ErrorCode.TodoNotFound ? 404 : 400)
            .json({ code: result.code, errorMessage: result.errorMessage });
    }
}

export { routes };

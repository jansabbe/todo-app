import { NextFunction, Request, Response } from "express";
import { initUseCases, UseCases } from "../application";
import { InMemoryTodoRepository } from "../infrastructure/outgoing";

export type Context = {
    useCases: UseCases;
};

declare global {
    namespace Express {
        export interface Request {
            context: Context;
        }
    }
}

const todoRepository = new InMemoryTodoRepository();
export function dependencyInjection(req: Request, res: Response, next: NextFunction) {
    req.context = { useCases: initUseCases(todoRepository) };
    next();
}

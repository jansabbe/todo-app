import { initUseCases, UseCases } from "../application/index.js";
import { InMemoryTodoRepository } from "../infrastructure/outgoing.js";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

declare module "fastify" {
    interface FastifyInstance {
        useCases: UseCases;
    }
}

const todoRepository = new InMemoryTodoRepository();

export async function dependencyInjection(
    app: FastifyInstance,
    { routes }: { routes: FastifyPluginAsync },
) {
    app.decorate("useCases", initUseCases(todoRepository));
    app.register(routes);
}

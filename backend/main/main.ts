import Fastify from "fastify";
import { dependencyInjection } from "./dependency-injection.js";
import { routes } from "../infrastructure/incoming.js";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

const app = Fastify({ logger: true }).withTypeProvider<JsonSchemaToTsProvider>();

app.register(dependencyInjection, { routes });

try {
    const address = await app.listen({ port: 8001 });
    app.log.info(`⚡️ Server started on ${address}`);
} catch (err) {
    app.log.error(err);
    process.exit(1);
}

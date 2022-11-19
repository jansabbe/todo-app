import express from "express";
import { dependencyInjection } from "./dependency-injection";
import { routes } from "../infrastructure/incoming";

const app = express();

app.use(dependencyInjection);
app.use(routes);

app.listen(8001, () => {
    console.log(`⚡️ Server started on port ${8001}`);
});

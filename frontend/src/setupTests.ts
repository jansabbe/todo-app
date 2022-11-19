import "@testing-library/jest-dom";
import { mswServer, resetTodos } from "./test-lib/test-server";

beforeAll(() => {
    mswServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
    mswServer.resetHandlers();
    resetTodos();
});

afterAll(() => {
    mswServer.close();
});

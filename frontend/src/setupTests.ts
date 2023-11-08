import "@testing-library/jest-dom/vitest";
import { mswServer, resetTodos } from "./test-lib/test-server";
import { setGlobalOrigin } from "undici";

beforeAll(() => {
    // Workaround for native fetch/msw2.0: https://github.com/mswjs/msw/issues/1625
    setGlobalOrigin(window.location.href);
    mswServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
    mswServer.resetHandlers();
    resetTodos();
});

afterAll(() => {
    mswServer.close();
});

import { render, screen } from "../../test-lib/test-utils";
import { AddTodoForm } from "./index.tsx";
import { mswServer } from "../../test-lib/test-server.ts";
import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

test("clear description after pressing enter", async () => {
    const { user } = render(<AddTodoForm />);
    const description = screen.getByRole("textbox", { name: /description/i });
    await user.type(description, "hello{Enter}");
    expect(description).toHaveValue("");
});

test("clear description after pressing add button", async () => {
    const { user } = render(<AddTodoForm />);
    const description = screen.getByRole("textbox", { name: /description/i });
    await user.type(description, "hello");
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(description).toHaveValue("");
});

function returnsError(errorMessage = faker.lorem.sentence()) {
    return () => HttpResponse.json({ code: "description_too_long", errorMessage }, { status: 400 });
}

test("given the user adds a todo, when the server returns an error, then the error message shows up", async () => {
    const errorMessage = "Description may not be more than 100 characters";
    mswServer.use(http.post("/api/todos", returnsError(errorMessage)));
    const { user } = render(<AddTodoForm />);
    const description = screen.getByRole("textbox", { name: /description/i });
    await user.type(description, "hello{Enter}");
    expect(description).toHaveAccessibleDescription(errorMessage);
});

test("given the user adds a todo, when the server returns an error, then the description is not cleared", async () => {
    mswServer.use(http.post("/api/todos", returnsError()));
    const { user } = render(<AddTodoForm />);
    const description = screen.getByRole("textbox", { name: /description/i });
    await user.type(description, "hello{Enter}");
    expect(description).toHaveValue("hello");
});

import { render, screen } from "./test-lib/test-utils";
import App from "./app";
import { within } from "@testing-library/react";
import { resetTodos } from "./test-lib/test-server.ts";
import { expect } from "vitest";

test("renders title", async () => {
    render(<App />);
    const title = screen.getByRole("heading", { name: /Todo/i });
    expect(title).toBeInTheDocument();
});

test("adding a todo", async () => {
    const { user } = render(<App />);

    const description = screen.getByRole("textbox", { name: /description/i });
    await user.type(description, "Adding a todo");
    await user.click(screen.getByRole("button", { name: /add/i }));

    const todo = await within(screen.getByRole("list")).findByText("Adding a todo");
    expect(todo).toBeInTheDocument();
});

test("when marking a todo done, footer is updated", async () => {
    resetTodos([{ id: "1", description: "My todo", done: false }]);
    const { user } = render(<App />);

    const todoCheckbox = await screen.findByRole("checkbox", { name: /my todo/i });
    await user.click(todoCheckbox);

    const doneText = screen.getByText("All done!");
    expect(doneText).toBeInTheDocument();
    expect(todoCheckbox).toBeChecked();
});

test("when deleting last todo, empty state should show up", async () => {
    resetTodos([{ id: "1", description: "My todo", done: false }]);
    const { user } = render(<App />);

    const removeButton = await screen.findByRole("button", { name: /remove/i });
    await user.click(removeButton);

    const emptyStateText = await screen.findByText("Add some todos");
    expect(emptyStateText).toBeInTheDocument();
});

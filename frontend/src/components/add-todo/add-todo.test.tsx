import { render, screen } from "../../test-lib/test-utils";
import { AddTodoForm } from "./index.tsx";

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

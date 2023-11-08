import { render, screen } from "../../test-lib/test-utils";
import { AddTodoForm } from "./index.tsx";

test("dummy test", () => {
    render(<AddTodoForm />);
    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toBeDisabled();
});

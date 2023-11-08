import { render, screen } from "./test-lib/test-utils";
import App from "./app";

test("renders title", async () => {
    render(<App />);
    const title = screen.getByRole("heading", { name: /Todo/i });
    expect(title).toBeInTheDocument();
});

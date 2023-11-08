import { render, screen } from "../../test-lib/test-utils";

test("dummy test", () => {
    render(<div>hello world</div>);
    expect(screen.getByText("hello world")).toBeInTheDocument();
});

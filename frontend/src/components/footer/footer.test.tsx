import { render, screen } from "../../test-lib/test-utils";
import { TodoTO } from "../../lib/api.ts";
import { faker } from "@faker-js/faker";
import { Footer } from "./index.tsx";

function aTodo(overrides: Partial<TodoTO> = {}): TodoTO {
    return {
        id: faker.string.uuid(),
        description: faker.lorem.sentence(),
        done: faker.datatype.boolean(),
        ...overrides,
    };
}

test('footer shows "All done!" when there are no todos left', () => {
    const todos = [aTodo({ done: true })];
    render(<Footer todos={todos} />);
    expect(screen.getByText("All done!")).toBeInTheDocument();
});

test('"1 todo left" when there is one', () => {
    const todos = [aTodo({ done: false })];
    render(<Footer todos={todos} />);
    expect(screen.getByText("1 todo left")).toBeInTheDocument();
});

test('"2 todos left" when there are two', () => {
    const todos = [aTodo({ done: false }), aTodo({ done: false })];
    render(<Footer todos={todos} />);
    expect(screen.getByText("2 todos left")).toBeInTheDocument();
});

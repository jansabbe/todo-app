import { countTodosLeft } from "./count.ts";
import { expect } from "vitest";
import { faker } from "@faker-js/faker";
import { TodoTO } from "../../lib/api.ts";

function aTodo(overrides: Partial<TodoTO> = {}): TodoTO {
    return {
        id: faker.string.uuid(),
        description: faker.lorem.sentence(),
        done: faker.datatype.boolean(),
        ...overrides,
    };
}

test("when passing an empty array, countTodosLeft should return 0", () => {
    expect(countTodosLeft([])).toEqual(0);
});

test("when passing an array where all todos are done, countTodosLeft should return 0", () => {
    const todos = [aTodo({ done: true }), aTodo({ done: true })];
    expect(countTodosLeft(todos)).toEqual(0);
});

test("when passing an array where 1 todo is done and 2 are not done, countTodosLeft should return 2", () => {
    const todos = [aTodo({ done: true }), aTodo({ done: false }), aTodo({ done: false })];
    expect(countTodosLeft(todos)).toEqual(2);
});

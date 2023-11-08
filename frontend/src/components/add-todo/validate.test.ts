import { isValid } from "./validate.ts";
import { expect } from "vitest";

test.each(["", " ", "\t"])(
    "when passing an empty string ('%s'), isValid should return false",
    (input) => {
        expect(isValid(input)).toEqual(false);
    },
);

test("when passing a string with text, isValid should return true", () => {
    expect(isValid("run in park")).toEqual(true);
});

// skipped because doing exercise 6
test.skip.each([
    { nbCharacters: 99, expected: true },
    { nbCharacters: 100, expected: false },
    { nbCharacters: 101, expected: false },
])(
    "when passing a string with $nbCharacters characters, isValid should return $expected",
    ({ nbCharacters, expected }) => {
        const description = Array(nbCharacters).fill("a").join("");
        expect(isValid(description)).toEqual(expected);
    },
);

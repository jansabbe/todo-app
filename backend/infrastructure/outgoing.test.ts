import { randomUUID } from "crypto";
import { Todo, TodoRepository } from "../domain/todo.js";
import { InMemoryTodoRepository } from "./outgoing.js";

function aTodo(overrides: Partial<Todo> = {}): Todo {
    return {
        id: randomUUID(),
        description: "go to gym",
        done: false,
        ...overrides,
    };
}
describe("InMemoryTodoRepository", () => {
    let repository: TodoRepository;

    beforeEach(() => {
        repository = new InMemoryTodoRepository();
    });

    it("should initially return an empty list of todos", () => {
        const result = repository.getAll();
        expect(result).toEqual([]);
    });

    it("should get previously saved todos", () => {
        const todo = aTodo();
        repository.save(todo);
        const result = repository.getAll();
        expect(result).toEqual([todo]);
    });

    it("should get a todo with a given id", () => {
        const todo = aTodo();
        repository.save(todo);
        const result = repository.findById(todo.id);
        expect(result).toEqual(todo);
    });

    it("should return null if id not found", () => {
        const result = repository.findById(randomUUID());
        expect(result).toBeNull();
    });

    it("should update an existing todo if id exists", () => {
        const todo = aTodo();
        repository.save(todo);
        const updatedTodo = { ...todo, name: "Do something else" };
        repository.save(updatedTodo);
        expect(repository.getAll()).toEqual([updatedTodo]);
    });

    it("should save a new todo if id does not exists", () => {
        const todo = aTodo();
        repository.save(todo);
        const newTodo = aTodo();
        repository.save(newTodo);
        expect(repository.getAll()).toEqual([todo, newTodo]);
    });

    it("should remove a todo if it exists", () => {
        const todo = aTodo();
        repository.save(todo);
        repository.remove(todo.id);
        expect(repository.getAll()).toEqual([]);
    });

    it("should not remove a todo if id does not exist", () => {
        const todo = aTodo();
        repository.save(todo);
        repository.remove(randomUUID());
        expect(repository.getAll()).toEqual([todo]);
    });
});

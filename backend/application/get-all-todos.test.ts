import { TodoRepository } from "../domain/todo.js";
import { InMemoryTodoRepository } from "../infrastructure/outgoing.js";
import { GetAllTodos, initGetAllTodos } from "./get-all-todos.js";

describe("Get all todos", () => {
    let getAllTodos: GetAllTodos;
    let todoRepository: TodoRepository;

    beforeEach(() => {
        todoRepository = new InMemoryTodoRepository();
        getAllTodos = initGetAllTodos(todoRepository);
    });

    test("returns an empty array when no todos", () => {
        expect(getAllTodos()).toEqual([]);
    });

    test("returns saved todos", () => {
        const todo1 = { id: "1", description: "First", done: false };
        const todo2 = { id: "2", description: "Second", done: true };
        todoRepository.save(todo1);
        todoRepository.save(todo2);

        expect(getAllTodos()).toEqual([todo1, todo2]);
    });
});

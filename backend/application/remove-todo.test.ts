import { TodoRepository } from "../domain/todo.js";
import { InMemoryTodoRepository } from "../infrastructure/outgoing.js";
import { RemoveTodo, initRemoveTodo } from "./remove-todo.js";

describe("Remove Todo", () => {
    let removeTodo: RemoveTodo;
    let todoRepository: TodoRepository;

    beforeEach(() => {
        todoRepository = new InMemoryTodoRepository();
        removeTodo = initRemoveTodo(todoRepository);
    });

    test("can remove a todo", () => {
        const todo1 = { id: "1", description: "something something", done: true };
        todoRepository.save(todo1);
        const todo2 = { id: "2", description: "something else", done: false };
        todoRepository.save(todo2);

        removeTodo({ id: todo1.id });
        expect(todoRepository.getAll()).toEqual([expect.objectContaining({ id: todo2.id })]);
    });

    test("does nothing when trying to remove non-existant todo", () => {
        expect(() => removeTodo({ id: "3223" })).not.toThrow();
    });
});

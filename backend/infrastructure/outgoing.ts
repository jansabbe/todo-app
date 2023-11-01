import { Todo, TodoRepository } from "../domain/todo.js";

export class InMemoryTodoRepository implements TodoRepository {
    private todos: Array<Todo> = [];

    getAll(): Array<Todo> {
        return [...this.todos];
    }

    findById(id: string): Todo | null {
        return this.todos.find((todo) => todo.id === id) ?? null;
    }

    save(todo: Todo): void {
        const index = this.todos.findIndex(({ id }) => id === todo.id);
        if (index >= 0) {
            this.todos[index] = todo;
        } else {
            this.todos.push(todo);
        }
    }

    remove(id: string): void {
        const index = this.todos.findIndex((todo) => id === todo.id);
        if (index >= 0) {
            this.todos.splice(index, 1);
        }
    }
}

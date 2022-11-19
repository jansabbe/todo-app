export type TodoRepository = {
    getAll(): Array<Todo>;
    findById(id: string): Todo | null;
    save(todo: Todo): void;
    remove(id: string): void;
};

export type Todo = {
    id: string;
    description: string;
    done: boolean;
};

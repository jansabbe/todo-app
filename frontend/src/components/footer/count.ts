import { TodoTO } from "../../lib/api.ts";

export function countTodosLeft(todos: Array<TodoTO>): number {
    const todosLeft = todos.filter((todo) => !todo.done);
    return todosLeft.length;
}

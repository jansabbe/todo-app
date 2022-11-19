import { TodoTO } from "../../lib/api";
import styles from "./footer.module.css";

export function countTodosLeft(todos: Array<TodoTO>): number {
    return todos.filter((todo) => !todo.done).length;
}

export function Footer({ todos }: { todos: Array<TodoTO> }) {
    const todosLeft = countTodosLeft(todos);
    const text = todosLeft === 1 ? "todo" : "todos";

    return (
        <footer className={styles.footer}>
            {todosLeft === 0 ? (
                <p>All done!</p>
            ) : (
                <p>
                    {todosLeft} {text} left
                </p>
            )}
        </footer>
    );
}

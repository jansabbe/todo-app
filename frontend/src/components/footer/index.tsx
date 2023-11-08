import { TodoTO } from "../../lib/api";
import styles from "./footer.module.css";
import { countTodosLeft } from "./count.ts";

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

import { EmptyState } from "../../lib/placeholders/empty-state";
import { ErrorPlaceholder } from "../../lib/placeholders/error-placeholder";
import { LoadingPlaceholder } from "../../lib/placeholders/loading-placeholder";
import { Footer } from "../footer";
import { TodoItem } from "../todo-item";
import styles from "./todo-list.module.css";
import { useTodos } from "./use-todos";

export function TodoList() {
    const { status, data } = useTodos();
    if (status === "error") {
        return (
            <div className={styles.wrapper}>
                <ErrorPlaceholder />
            </div>
        );
    }
    if (status === "pending") {
        return (
            <div className={styles.wrapper}>
                <LoadingPlaceholder />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={styles.wrapper}>
                <EmptyState />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <ul className={styles.todoList}>
                {data.map((todo) => (
                    <li key={todo.id}>
                        <TodoItem todo={todo} />
                    </li>
                ))}
            </ul>
            <Footer todos={data} />
        </div>
    );
}

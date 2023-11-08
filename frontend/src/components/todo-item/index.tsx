import classNames from "classnames";
import { useId } from "react";
import { TodoTO } from "../../lib/api";
import { RemoveTodoButton } from "../remove-todo";
import styles from "./todo-item.module.css";
import { useMarkTodoStatus } from "./use-mark-todo-status";

export function TodoItem({ todo }: { todo: TodoTO }) {
    const id = useId();
    const { mutate, isPending } = useMarkTodoStatus({ id: todo.id });
    return (
        <div className={styles.wrapper}>
            <input
                id={`${id}-checkbox`}
                type="checkbox"
                className={styles.inputCheckbox}
                checked={todo.done}
                disabled={isPending}
                onChange={(e) => mutate({ done: e.target.checked })}
            />
            <label
                htmlFor={`${id}-checkbox`}
                className={classNames(styles.description, {
                    [styles.checked]: todo.done,
                })}
            >
                {todo.description}
            </label>
            <RemoveTodoButton id={todo.id} className={styles.deleteButton} />
        </div>
    );
}

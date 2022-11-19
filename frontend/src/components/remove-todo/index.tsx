import classNames from "classnames";
import styles from "./remove-todo.module.css";
import { TrashIcon } from "../../lib/trash-icon";
import { useRemoveTodo } from "./use-remove-todo";

export function RemoveTodoButton({ id, className }: { id: string; className?: string }) {
    const { mutate } = useRemoveTodo({ id });

    return (
        <button
            type="button"
            onClick={() => mutate()}
            className={classNames([styles.iconButton, className])}
        >
            <TrashIcon />
            <span className="hidden-but-accessible">Remove</span>
        </button>
    );
}

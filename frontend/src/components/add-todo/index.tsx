import { FormEvent, useId, useState } from "react";
import styles from "./add-todo.module.css";
import { useAddTodo } from "./use-add-todo";

export function isValid(description: string): boolean {
    return description.trim().length > 0;
}

export function AddTodoForm() {
    const id = useId();
    const [description, setDescription] = useState("");
    const { mutate, error, isLoading } = useAddTodo();

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        mutate({ description }, { onSuccess: () => setDescription("") });
    };

    return (
        <form onSubmit={onSubmit} className={styles.wrapper}>
            <div className={styles.inputWrapper}>
                <label className={styles.label} htmlFor={`description-${id}`}>
                    Description
                </label>

                <input
                    id={`description-${id}`}
                    type="text"
                    value={description}
                    className={styles.inputText}
                    placeholder="Jog around the park"
                    autoComplete="off"
                    autoFocus
                    onChange={(v) => setDescription(v.target.value)}
                    {...(error ? { "aria-describedby": `error-${id}` } : {})}
                />
                {error && (
                    <p id={`error-${id}`} className={styles.errorMessage}>
                        {error.response.errorMessage}
                    </p>
                )}
            </div>
            <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading || !isValid(description)}
            >
                {!isLoading ? "Add" : "Adding..."}
            </button>
        </form>
    );
}

import styles from "./app.module.css";
import { AddTodoForm } from "./components/add-todo";
import { TodoList } from "./components/todo-list";

export default function App() {
    return (
        <>
            <div className={styles.appHeader}> </div>
            <div className={styles.app}>
                <main className={styles.appContent}>
                    <header>
                        <h1 className={styles.title}>Todo</h1>
                    </header>
                    <AddTodoForm />
                    <TodoList />
                </main>
            </div>
        </>
    );
}

import classNames from "classnames";
import styles from "./image-placeholder.module.css";

export function EmptyState() {
    return (
        <div className={styles.wrapper}>
            <div className={classNames(styles.image, styles.emptyImage)} aria-hidden />
            <div className={styles.message}>Add some todos</div>
        </div>
    );
}

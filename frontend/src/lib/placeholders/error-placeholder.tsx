import classNames from "classnames";
import styles from "./image-placeholder.module.css";

export function ErrorPlaceholder() {
    return (
        <div className={styles.wrapper}>
            <div className={classNames(styles.image, styles.errorImage)} aria-hidden />
            <div className={styles.message}>Something broke</div>
        </div>
    );
}

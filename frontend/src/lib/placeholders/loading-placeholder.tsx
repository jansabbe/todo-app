import classNames from "classnames";
import styles from "./loading-placeholder.module.css";

export function LoadingPlaceholder() {
    return (
        <>
            <div className={classNames(styles.wrapper, styles.shimmer)} aria-hidden>
                <div className={styles.checkboxPlaceholder}></div>
                <div className={styles.descriptionPlaceholder}></div>
            </div>
            <div
                className={classNames(styles.wrapper, styles.shimmer)}
                style={{ "--animation-delay": "0.1s" } as React.CSSProperties}
                aria-hidden
            >
                <div className={styles.checkboxPlaceholder}></div>
                <div className={styles.descriptionPlaceholder}></div>
            </div>
            <div
                className={classNames(styles.wrapper, styles.shimmer)}
                style={{ "--animation-delay": "0.2s" } as React.CSSProperties}
                aria-hidden
            >
                <div className={styles.checkboxPlaceholder}></div>
                <div className={styles.descriptionPlaceholder}></div>
            </div>
            <div className="hidden-but-accessible">Loading...</div>
        </>
    );
}

import styles from "./dotdivider.module.css"

export default function DotDivider() {
    return (
        <div className={styles.outer}>
            <div className={styles.container}>
                <div/>
                <div/>
                <div/>
            </div>
        </div>
    )
}
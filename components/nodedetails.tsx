import styles from "./nodedetails.module.css"

export interface NodeDetailsProps {
    top: number;
    left: number;
    id: string;
}

export default function NodeDetails(details: NodeDetailsProps) {
    const { Timestamp, EntityID } = JSON.parse(details.id)
    return (
        <div className={styles.container} style={{top: details.top, left: details.left+25}}>
            <span>Timestamp: {Timestamp}</span>
            <span>EntityID: {EntityID}</span>
        </div>
    )
}
import { useEffect, useRef, useState } from "react";
import styles from "./client.module.css"
import { Tree } from "./utils/causaltree";

interface ClientProps {
    clientId: number; 
    color?: string;
    tree: Tree
    onTreeUpdated: (tree: Tree) => void;
    onNodeRemoved: (id: string) => void;
}

export default function Client(props: ClientProps) {
    const [text, setText] = useState<string>("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (props.tree) {
            setText(props.tree.String())
        }
    })

    const onChange = (e) => {
        const tree = props.tree;

        const index = inputRef.current.selectionStart;
        const nodes = tree.OrderedCausalNodes(false);
        const parent = nodes[index-1] ?? tree.Root

        if (e.nativeEvent.inputType === "deleteContentBackward") {
            const toBeDeleted = nodes[index+1];
            tree.RemoveCausalNode(toBeDeleted.ID);
            props.onNodeRemoved(JSON.stringify(toBeDeleted.ID))
        } else {
            let v = e.target.value[index-1];
            tree.AddCausalNode(JSON.parse(JSON.stringify((parent.ID))), v, props.clientId);
            props.onTreeUpdated(tree);
        }

        // Effects.
        setText(tree.String());
    }

    return (
        <div className={styles.container}>
            <span className={styles.title} style={{color: props.color ?? "#fff"}}>{`Client ${props.clientId}`}</span>
            <input 
                type="text"
                placeholder={"|"}
                className={styles.textInput} 
                onChange={onChange}
                value={text}
                ref={inputRef}
                />
        </div>
    )
}

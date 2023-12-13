import { useEffect, useState } from "react";
import Client from "./client";
import Tree, { NodeData } from "./tree";
import styles from "./causalscene.module.css"
import NodeDetails from "./nodedetails";

import { Tree as CausalTree } from "./utils/causaltree";
import {
    Node,
    Edge,
} from 'reactflow';

import { IDsDemoTree, ThreeClientDemoTree } from "./utils/idsdemotree";

export enum Scenes {
    ThreeClient = 'three-client',
    TwoClient = 'two-client',
    IDDemo = 'id-demo'
}

export default function CausalScene({ scene }) {
    const [nodeDetails, setNodeDetails] = useState(null)
    const [tree, setTree] = useState<CausalTree>();
    const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // id-demo only.
    const [shouldReveal, setShouldReveal] = useState(false);

    // 3-client demo only.
    const [traversalDemo, setTraversalDemo] = useState(false);

    useEffect(() => {
        let t: CausalTree;

        switch (scene) {
            case (Scenes.ThreeClient):
                t = ThreeClientDemoTree();
                break;
            case (Scenes.TwoClient):
                t = new CausalTree(1);
                break;
            case (Scenes.IDDemo):
                t = IDsDemoTree();
                break;
        }

        setTree(t);
        onTreeUpdated(t);
    }, []);

    const resetTree = () => {
        setTree(new CausalTree(tree.ID.EntityID));
        setNodes([]);
        setEdges([]);
    }

    const highlightNode = (id: string) => {
        setNodes(nodes.map((node) => {
            if (node.id === id) {
                node.style = {
                    ...node.style,
                    boxShadow: "#fff 0px 0px 9px 0px",
                }
                return node
            }

            node.style = {
                ...node.style,
                boxShadow: "rgba(0, 0, 0, 0.533) 0px 0px 9px 0px",
            }
            return node
        }));
    }

    const unhighlight = () => {
        setNodes(nodes.map((node) => {
            node.style = {
                ...node.style,
                boxShadow: "rgba(0, 0, 0, 0.533) 0px 0px 9px 0px",
            }
            return node;
        }));
    }

    const showTraversal = () => {
        if (!tree || !nodes || traversalDemo) {
            return;
        }

        setTraversalDemo(true);

        // Take me back to backend.

        const ordered = tree.OrderedCausalNodes(true);
        ordered.forEach((n, i) => {
            setTimeout(() => {
                highlightNode(JSON.stringify(n.ID));

                if (i === ordered.length-1) {
                    setTimeout(() => {
                        setTraversalDemo(false);
                        unhighlight();
                    }, 500)
                }
            }, i*500);
        })
    }

    const onNodeRemoved = (id: string) => {
        /*
            If you try to update a node by a tree operation then 
            the whole damn tree collapses and I've wasted 10+ hours
            trying to figure out why.

            Updating the node data directly works.
        */
        setNodes(nodes.map((node) => {
            if (node.id === id) {
                node.data = {
                    ...node.data,
                    label: "🪦",
                }
                return node
            }
            return node
        }))
    }

    const onTreeUpdated = (tree: CausalTree) => {
        let _edges = [];
        let _nodes = [];

        for (let cn of tree.OrderedCausalNodes(true)) {
            let label = "";
            if (cn.ID.Timestamp === 0) {
                label = "root"
            } else {
                label = cn.Removed ? "🪦" : cn.V
            }

            let color = '#fff';
            if (scene === Scenes.ThreeClient) {
                if (cn.ID.EntityID === 1) {
                    color = '#CCE6F4';
                }
                if (cn.ID.EntityID === 2) {
                    color = '#E8DCB9';
                }
                if (cn.ID.EntityID === 3) {
                    color = '#D0ABFF';
                }
            }

            _nodes.push({
                id: JSON.stringify(cn.ID),
                data: { label, color },
                position: { x: 0, y: 0 },
                type: 'custom',
                style: { 
                    opacity: 0,
                },
            });

            if (cn.Parent) {
                _edges.push({
                    id: `${JSON.stringify(cn.Parent.ID)}->${JSON.stringify(cn.ID)}`,
                    source: `${JSON.stringify(cn.Parent.ID)}`,
                    target: `${JSON.stringify(cn.ID)}`,
                    style: { opacity: 0 },
                });
            }
        }

        setNodes(_nodes);
        setEdges(_edges);
    }

    const onNodeMouseEnter = (event, node) => {
        const { pageX: x, pageY: y } = event
        setNodeDetails(
            <NodeDetails top={y} left={x} id={node.id} />)
    }

    const onNodeMouseLeave = (e, n) => {
        setNodeDetails(null)
    }

    return (
        <div>
            {scene === Scenes.TwoClient &&
                <>
                    <div className={styles.clientContainer}>
                        <Client
                            tree={tree}
                            clientId={1}
                            onNodeRemoved={onNodeRemoved}
                            onTreeUpdated={onTreeUpdated}
                        />

                        <div style={{ width: 25 }} />

                        <Client
                            tree={tree}
                            clientId={2}
                            onNodeRemoved={onNodeRemoved}
                            onTreeUpdated={onTreeUpdated}
                        />
                    </div>
                    <button className={styles.resetButton} onClick={resetTree}>RESET</button>
                </>
            }

            {scene === Scenes.ThreeClient &&
                <>
                    <div className={styles.clientContainer}>
                        <Client
                            tree={tree}
                            clientId={1}
                            onNodeRemoved={onNodeRemoved}
                            onTreeUpdated={onTreeUpdated}
                            color={"#CCE6F4"}
                        />

                        <div style={{ width: 25 }} />

                        <Client
                            tree={tree}
                            clientId={2}
                            onNodeRemoved={onNodeRemoved}
                            onTreeUpdated={onTreeUpdated}
                            color={"#E8DCB9"}
                        />

                        <div style={{ width: 25 }} />

                        <Client
                            tree={tree}
                            clientId={3}
                            onNodeRemoved={onNodeRemoved}
                            onTreeUpdated={onTreeUpdated}
                            color={"#D0ABFF"}
                        />
                    </div>
                    <button className={styles.resetButton} onClick={showTraversal}>{traversalDemo ? "Traversing" : "Show Traversal"}</button>
                </>
            }

            {scene === Scenes.IDDemo &&
                <>
                    <button className={styles.resetButton} onClick={() => { setShouldReveal(true) }}>REVEAL</button>
                    {shouldReveal && <span style={{ 'marginLeft': 10 }}>"Causal trees"</span>}
                </>
            }

            {!!nodeDetails && nodeDetails}

            <Tree
                nodes={nodes}
                edges={edges}
                setNodes={setNodes}
                setEdges={setEdges}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                direction={'TB'}
            />
        </div>
    )
}
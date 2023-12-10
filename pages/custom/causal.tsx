import { useEffect, useRef, useState } from "react";

import Client from "../../components/client";
import Tree, { NodeData } from "../../components/tree";
import styles from "./causal.module.css"

import { Tree as CausalTree } from "../../components/utils/causaltree";
import {
    Node,
    Edge,
} from 'reactflow';
import DotDivider from "../../components/dotdivider";
import NodeDetails from "../../components/nodedetails";


export default function Causal() {
    const [nodeDetails, setNodeDetails] = useState(null)
    const [tree, setTree] = useState<CausalTree>();
    const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const t = new CausalTree(1);
        setTree(t);
        onTreeUpdated(t)
    }, [])

    const resetTree = () => {
        setTree(new CausalTree(tree.ID.EntityID));
        setNodes([]);
        setEdges([]);
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

            _nodes.push({
                id: JSON.stringify(cn.ID),
                data: { label },
                position: { x: 0, y: 0 },
                type: 'custom',
                style: { opacity: 0 },
            });

            if (cn.Parent) {
                _edges.push({
                    id: `${JSON.stringify(cn.Parent.ID)} -> ${JSON.stringify(cn.ID)}`,
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
        const {pageX: x, pageY: y} = event
        setNodeDetails(
            <NodeDetails top={y} left={x} id={node.id} />)

    }

    const onNodeMouseLeave = (e, n) => {
        setNodeDetails(null)
    }

    return (
        <div>
            <p>
            I recently came across an elegant CRDT design that is useful for text collaboration applications. What follows is the blog post I wish I had when I started learning about CRDTs, I hope you find it informative.
            </p>

            <p>
            CRDTs are a family of algorithms and datastructures that provide eventual consistency guarantees by implementing some simple mathematical properties. As their popularity has increased over the last decade so too has their usage. CRDTS are commonly found in collaborative applications, where concurrent updates can be frequent, but they’re also used quite extensively in local network or peer-to-peer environments, due to the algorithms not requiring a central authority to reconcile inconsistencies.
            </p>

            <p>
            The CRDT I will be describing today is the Causal Tree (roughly as defined by Grischenko). Which we will break down while implementing a simple text collaboration application. But before we go too far, try and get an intuitive sense of the tree algorithm by playing with the demo below. Some things to keep an eye out for are the ids associated with each node (on hover), and pay attention to what happens when individual characters are deleted.
            </p>

            <DotDivider />

            <div>
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

                { !!nodeDetails && nodeDetails}
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
        </div>
    )
}
import React, { useEffect } from 'react';
import ReactFlow, {
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  NodeTypes,
  OnNodesChange,
  applyNodeChanges,
  NodeChange,
  OnEdgesChange,
  EdgeChange,
  applyEdgeChanges,
} from 'reactflow';

import CustomNode from './customnode';
import useAutoLayout, { Direction } from './utils/useAutoLayout';

import 'reactflow/dist/style.css';
import styles from './tree.module.css';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const proOptions = {
  account: 'paid-pro',
  hideAttribution: true,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 },
};

type ExampleProps = {
    nodes: Node<NodeData>[];
    edges: Edge[];
    setNodes: any;
    setEdges: any;
    onNodeMouseEnter: (event, node) => void;
    onNodeMouseLeave: (event, node) => void;
    direction?: Direction;
};

export type NodeData = {
  label: string;
};


const TreeView = (props: ExampleProps) => {
  const { fitView } = useReactFlow();

  useAutoLayout({ direction: props.direction });

  const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
    props.setNodes((nodes) => applyNodeChanges(changes, nodes));
  };

  const onEdgesChange: OnEdgesChange = (changes: EdgeChange[]) => {
    props.setEdges((edges) => applyEdgeChanges(changes, edges));
  };

  useEffect(() => {
    fitView({ duration: 400 });
  }, [props.nodes, fitView]);


  return (
    <div className={styles.container}>
      <ReactFlow
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        nodes={props.nodes}
        edges={props.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={props.onNodeMouseEnter}
        onNodeMouseLeave={props.onNodeMouseLeave}
        fitView
        // newly added edges get these options automatically
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={-Infinity}
        maxZoom={Infinity}
      />
    </div>
  );
}

const ReactFlowWrapper = (props: ExampleProps) => {
  return (
    <ReactFlowProvider>
      <TreeView {...props} />
    </ReactFlowProvider>
  );
};

export default ReactFlowWrapper;

import {
  React, useState, useEffect, useCallback
} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionMode,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.scss';

import FlowNode from './FlowNode';
import FlowEdge from './FlowEdge'; 

const nodeTypes = {
  default: FlowNode,
};

const edgeTypes = {
  default: FlowEdge,
};

const defaultViewport = { x: 0, y: 0, zoom: 1, };

function Flow(props) {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const createNode = (node) => {
    if (!node.position) return;
    const n = {
      id: node.id,
      data: {
        node
      },
      type: 'default',
      position: { x: node.position.x, y: node.position.y, },
      style: {
        width: 50, height: 50, padding: 0, borderColor: 'white',
      },
    };
    setNodes((nds) => nds.concat(n));
  };

  const createEdge = (source, target, label, id) => {
    const edge = {
      id,
      source,
      target,
      sourceHandle: 'center',
      targetHandle: 'center',
      label,
      labelShowBg: false,
      type: 'default',
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, },
    };
    setEdges((eds) => eds.concat(edge));
    return edge;
  };

  const renderNodes = () => {
    setNodes([]);
    props.nodes.forEach((node) => {
      createNode(node);
    });
  };

  const renderEdges = () => {
    setEdges([]);
    props.edges.forEach((edge) => {
      createEdge(
        edge.source_ref,
        edge.target_ref,
        edge.relationship_type,
        edge.id
      );
    });
  };

  const rerender = () => {
    renderNodes();
    renderEdges();
    props.setUpdateFlow(false);
  };

  const onConnect = useCallback((params) => {
    props.onConnectNodeHandler(params.source, params.target);
  }, []);

  const onEdgeClick = (event, edge) => {
    props.onClickRelHandler(edge.id);
  };

  const onNodeClick = (event, node) => {
    if (props.groupMode) {
      props.onClickGroupNodeHandler(node.id);
    } else {
      props.onClickHandler(node.id);
    }
  };

  const onNodeDragStop = useCallback((event, node) => {
    event.preventDefault();
    props.onDragStopNodeHandler(node);
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX + 50,
        y: event.clientY + 50,
      });
      props.setMousePosition(position.x, position.y);
    },
    [reactFlowInstance]
  );

  useEffect(rerender, [props.updateFlow]);
  useEffect(rerender, [props.updateFlow]);

  return (
    <ReactFlowProvider>
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeDragStop={onNodeDragStop}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={defaultViewport}
          nodeOrigin={[0.5, 0.5]}
          attributionPosition="bottom-left"
          nodesDraggable
          connectionMode={ConnectionMode.Loose}
        >
          <Background color="black" variant="dots" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default Flow;

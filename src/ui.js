// ui.js
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import NodeTemplate from './nodes/NodeTemplate';
import nodeTypes from './nodeTypes';
import { Box, Tabs, Tab, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  flows: state.flows,
  currentFlow: state.currentFlow,
  createFlow: state.createFlow,
  setCurrentFlow: state.setCurrentFlow,
  removeFlow: state.removeFlow,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    flows,
    currentFlow,
    createFlow,
    setCurrentFlow,
    removeFlow,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  useEffect(() => {
    if (Object.keys(flows).length === 0) {
      const newFlowId = `flow-${Date.now()}`;
      createFlow(newFlowId, `Flow 1`);
    }
  }, [flows, createFlow]);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          dragHandle: '.custom-drag-handle',
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentFlow(newValue);
  };

  // Handle adding a new flow
  const handleAddFlow = () => {
    const newFlowId = `flow-${Date.now()}`;
    createFlow(newFlowId, `Flow ${Object.keys(flows).length + 1}`);
  };

  // Handle removing a flow
  const handleRemoveFlow = (flowId) => {
    if (Object.keys(flows).length > 1) {
      removeFlow(flowId);
    }
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
        <Tabs value={currentFlow} onChange={handleTabChange} aria-label="react-flow tabs">
          {Object.entries(flows).map(([flowId, flow]) => (
            <Tab key={flowId} label={flow.name} value={flowId} />
          ))}
        </Tabs>
        <IconButton onClick={handleAddFlow} 
        sx={{ position: 'absolute', right: 0, top: 0 }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      {currentFlow && (
        <Box ref={reactFlowWrapper} sx={{ width: '100%', height: '75vh', backgroundColor: "#fff" }}>
          <ReactFlow
            nodes={flows[currentFlow]?.nodes || []}
            edges={flows[currentFlow]?.edges || []}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            proOptions={proOptions}
            snapGrid={[gridSize, gridSize]}
            connectionLineType='smoothstep'
          >
            <Background color="#aaa" gap={gridSize} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>
      )}
    </Box>
  );
};

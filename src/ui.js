// ui.js
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import nodeTypes from './nodeTypes';
import { Box, Tabs, Tab, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');

  useEffect(() => {
    if (Object.keys(flows).length === 0) {
      const newFlowId = `flow-${Date.now()}`;
      createFlow(newFlowId, `Flow 1`);
    }
  }, [flows, createFlow]);

  const getInitNodeData = (nodeID, type) => {
    return { id: nodeID, nodeType: `${type}` };
  };

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
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentFlow(newValue);
  };

  const handleAddFlow = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFlowNameChange = (event) => {
    setNewFlowName(event.target.value);
  };

  const handleCreateFlow = () => {
    if (newFlowName.trim()) {
      const newFlowId = `flow-${Date.now()}`;
      createFlow(newFlowId, newFlowName);
      setNewFlowName('');
      setDialogOpen(false);
    }
  };

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
            <Tab
            key={flowId}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {flow.name}
                <IconButton size="small" onClick={() => handleRemoveFlow(flowId)} sx={{ ml: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
            value={flowId}
          />
          ))}
          <IconButton
            onClick={handleAddFlow}
            sx={{ width:50 }}
          >
            <AddIcon />
          </IconButton>
        </Tabs>
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
            <Background color="#ccc" gap={gridSize}  />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create New Pipeline Flow</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="flowName"
            label="Flow Name"
            type="text"
            fullWidth
            variant="standard"
            value={newFlowName}
            onChange={handleFlowNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant= "outlined" onClick={handleDialogClose}>Cancel</Button>
          <Button variant= "contained" style={{backgroundColor: '#1B2845', color:"white"}} onClick={handleCreateFlow}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

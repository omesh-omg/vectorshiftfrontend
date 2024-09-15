// store.js

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  reconnectEdge
} from 'reactflow';


const loadState = () => {
  try {
    const serializedState = localStorage.getItem('flowState');
    if (serializedState === null) {
      return { nodes: [], edges: [], nodeIDs: {} };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state from local storage', err);
    return { nodes: [], edges: [], nodeIDs: {} };
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('flowState', serializedState);
  } catch (err) {
    console.error('Failed to save state to local storage', err);
  }
};

export const useStore = create((set, get) => ({
  ...loadState,
  nodes: [],
  edges: [],
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    const newNodes = [...get().nodes, node];
    set({ nodes: newNodes });
    saveState({ nodes: newNodes, edges: get().edges, nodeIDs: get().nodeIDs });

  },
  onNodesChange: (changes) => {
    const newNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: newNodes });
    saveState({ nodes: newNodes, edges: get().edges, nodeIDs: get().nodeIDs });

  },
  onEdgesChange: (changes) => {
    const newEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: newEdges });
    saveState({ nodes: get().nodes, edges: newEdges, nodeIDs: get().nodeIDs });

  },
  onRemoveNode: (nodeId) => {
    const newNodes = get().nodes.filter(node => node.id !== nodeId);
    set({ nodes: newNodes });
    saveState({ nodes: newNodes, edges: get().edges, nodeIDs: get().nodeIDs });

  },
  onConnect: (connection) => {
    const newEdges = addEdge({
      ...connection,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' }
    }, get().edges);
    set({ edges: newEdges });
    saveState({ nodes: get().nodes, edges: newEdges, nodeIDs: get().nodeIDs });
 },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    const newNodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        node.data = { ...node.data, [fieldName]: fieldValue };
      }
      return node;
    });
    set({ nodes: newNodes });
    saveState({ nodes: newNodes, edges: get().edges, nodeIDs: get().nodeIDs });

  },
}));

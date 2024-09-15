// store.js

import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

// Utility function to load the initial state from localStorage
const loadInitialState = () => {
  try {
    const storedState = localStorage.getItem('react-flow-state');
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  // Return default state if no state in localStorage
  const initialFlowId = 'flow-1';
  return {
    flows: {
      [initialFlowId]: {
        name: 'Your Pipeline Flow',
        nodes: [],
        edges: [],
      },
    },
    currentFlow: initialFlowId,
  };
};

// Utility function to save the state to localStorage
const saveStateToLocalStorage = (state) => {
  try {
    localStorage.setItem('react-flow-state', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

export const useStore = create((set, get) => {
  // Initialize state from localStorage
  const initialState = loadInitialState();
  
  return {
    ...initialState,
    createFlow: (id, name) => {
      set((state) => {
        const newState = {
          flows: {
            ...state.flows,
            [id]: {
              name,
              nodes: [],
              edges: [],
            },
          },
          currentFlow: id,
        };
        saveStateToLocalStorage(newState);
        return newState;
      });
    },
    setCurrentFlow: (id) => {
      set((state) => {
        const newState = {
          ...state,
          currentFlow: id,
        };
        saveStateToLocalStorage(newState);
        return newState;
      });
    },
    removeFlow: (id) => {
      set((state) => {
        const { [id]: _, ...remainingFlows } = state.flows;
        const newCurrentFlow = state.currentFlow === id
          ? Object.keys(remainingFlows)[0] || null
          : state.currentFlow;
        const newState = {
          flows: remainingFlows,
          currentFlow: newCurrentFlow,
        };
        saveStateToLocalStorage(newState);
        return newState;
      });
    },
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
      set((state) => {
        const currentFlow = state.currentFlow;
        const newState = {
          ...state,
          flows: {
            ...state.flows,
            [currentFlow]: {
              ...state.flows[currentFlow],
              nodes: [...state.flows[currentFlow].nodes, node],
            },
          },
        };
        saveStateToLocalStorage(newState);
        return newState;
      });
    },
    onNodesChange: (changes) => {
      set((state) => {
        const currentFlow = state.currentFlow;
        const newState = {
          ...state,
          flows: {
            ...state.flows,
            [currentFlow]: {
              ...state.flows[currentFlow],
              nodes: applyNodeChanges(changes, state.flows[currentFlow].nodes),
            },
          },
        };
        saveStateToLocalStorage(newState);
        return newState;
      });
    },
    onEdgesChange: (changes) => {
      set((state) => {
        const currentFlow = state.currentFlow;
        const newState = {
          ...state,
          flows: {
            ...state.flows,
            [currentFlow]: {
              ...state.flows[currentFlow],
              edges: applyEdgeChanges(changes, state.flows[currentFlow].edges),
            },
          },
        };
        saveStateToLocalStorage(newState);
        return newState;
      });
    },
    onConnect: (connection) => {
      set((state) => {
        const currentFlow = state.currentFlow;
        const newState = {
          ...state,
          flows: {
            ...state.flows,
            [currentFlow]: {
              ...state.flows[currentFlow],
              edges: addEdge({ ...connection, type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' } }, state.flows[currentFlow].edges),
            },
          },
        };
        saveStateToLocalStorage(newState);
        return newState;
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set((state) => {
        const currentFlow = state.currentFlow;
        const newState = {
          ...state,
          flows: {
            ...state.flows,
            [currentFlow]: {
              ...state.flows[currentFlow],
              nodes: state.flows[currentFlow].nodes.map((node) => {
                if (node.id === nodeId) {
                  node.data = { ...node.data, [fieldName]: fieldValue };
                }
                return node;
              }),
            },
          },
        };
        saveStateToLocalStorage(newState);
        return newState;
      });
    },
  };
});

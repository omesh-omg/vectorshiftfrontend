// Nodes.js
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import NodeTemplate from './NodeTemplate';
import { Handle, Position } from 'reactflow';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import addNodeTypes, { nodeTypes } from '../nodeTypes';
import icon from '../images/icon.png'; // Path to your icon

// selector to use zustand store
const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    getNodeID: state.getNodeID,
    addNode: state.addNode,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
});
// nodes using the NodeTemplate demonstrating abstraction

const sourceHandleConfigInputNode = [
    { position: Position.Right, id: 'output' },
];

const targetHandleConfigOutputNode = [
    { position: Position.Left, id: 'input1' },

];
const sourceHandleConfigLLMNode = [
    { position: Position.Right, id: 'output' },
];

const targetHandleConfigLLMNode = [
    { position: Position.Left, id: 'input1' },
    { position: Position.Left, id: 'input2' },
];
const inputFieldConfigLLMNode = [
    { name: 'inputSystem', label: 'System', type: 'text' },
    { name: 'inputPrompt', label: 'Prompt', type: 'text', options: ['Text', 'File'] },
    { name: 'model', label: 'Model', type: 'select', options: ['GPTo', 'GPT_3.5', 'GPT_4'] },

];

const inputFieldConfig = [
    { name: 'inputName', label: 'Name', type: 'text' },
    { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'] },
];


export const GoogleLLM = (props) => (
    <NodeTemplate
        sourceHandles={
            [
                { position: Position.Left, id: 'input1' },
                { position: Position.Left, id: 'input2' },
            ]
        }
        targetHandles={
            [
                { position: Position.Right, id: 'output' },
            ]
        }
        inputFields={
            [
                { name: 'inputSystem', label: 'System', type: 'text' },
                { name: 'inputPrompt', label: 'Prompt', type: 'text', options: ['Text', 'File'] },
                { name: 'model', label: 'Model', type: 'select', options: ['GeminiPro', 'GeminiPro1.5', 'Text-bison'] }
            ]}
        description="Try entering ststem prompt and mention Model"
        subheading="This is a LLM by Google"
        heading="Google LLM"
        {...props}
        icon="google"
    />
);

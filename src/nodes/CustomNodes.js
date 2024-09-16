// Nodes.js
import React from 'react';
import NodeTemplate from './NodeTemplate';
import { Position } from 'reactflow';


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
                { position: Position.Right, id: 'output' },
            ]
        }
        targetHandles={
            [
                { position: Position.Left, id: 'input1' },
                { position: Position.Left, id: 'input2' },
                
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
        icon="google"
        {...props}
    />
);

export const CustomNode = (props) => (
    <NodeTemplate
        sourceHandles={
            [
                { position: Position.Right, id: 'output' },
            ]
        }
        targetHandles={
            [
                { position: Position.Left, id: 'input1' },
                { position: Position.Left, id: 'input2' },
                
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
        icon="google"
        {...props}
    />
);
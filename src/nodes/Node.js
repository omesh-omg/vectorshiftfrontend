// Nodes.js
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import NodeTemplate from './NodeTemplate';
import { Handle, Position } from 'reactflow';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import  addNodeTypes , {nodeTypes}    from '../nodeTypes';

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
    { name: 'model', label: 'Model', type: 'select', options: ['GPTo', 'GPT_3.5', 'GPT_4' ] },

];

const inputFieldConfig = [
    { name: 'inputName', label: 'Name', type: 'text' },
    { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'] },
];

export const InputNode = (props) => (
    <NodeTemplate
        sourceHandles={sourceHandleConfigInputNode}
        targetHandles={[]}
        inputFields={inputFieldConfig}
        heading="Input Node"
        subheading="Handles user input"
        description="This node captures user input."
        {...props}
        icon="right-to-bracket"
    />
);

export const OutputNode = (props) => (
    <NodeTemplate
        sourceHandles={[]}
        targetHandles={targetHandleConfigOutputNode}
        inputFields={[{ name: 'outputName', label: 'Name', type: 'text' }, { name: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image'] },
        ]}
        heading="Output Node"
        subheading="Displays output"
        description="This node displays the output."
        {...props}
        icon="right-from-bracket"
    />
);
// export const InputNode = (props) => <NodeTemplate type="Input" {...props} />;
// export const OutputNode = (props) => <NodeTemplate type="Output" {...props} />;

export const LLMNode = (props) => (
    <NodeTemplate
        sourceHandles={sourceHandleConfigLLMNode}
        targetHandles={targetHandleConfigLLMNode}
        inputFields={inputFieldConfigLLMNode}
        description="This is a LLM."
        subheading="ChatGpt 40"
        heading="LLM"
        {...props}
        icon="chart-bar"
    />
);

// export const LLMNode = (props) => <NodeTemplate type="LLM" {...props} />;
// export const TextNode = (props) => (
//     <NodeTemplate 
//       sourceHandles={[
//         { position: Position.Right, id: 'value' },
//       ]} 
//       targetHandles={[ ]} 
//       inputFields={[
//         { name: 'text', label: 'Text', type: 'text' },
//       ]} 
//       heading="Text Node"
//       description="This is a text node."
//       {...props} 
//     />
//   );



export const TextNode = (props) => {
    const [text, setText] = useState(props.data?.text || '');
    const [handles, setHandles] = useState([]);
    const [nodeDimensions, setNodeDimensions] = useState({ width: 200, height: 80 });


    // Extract variables from text and update handles
    useEffect(() => {
        const regex = /{{\s*([\w]+)\s*}}/g;
        const foundHandles = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const variableName = match[1];
            foundHandles.push({
                id: variableName,
                type: 'target',
                position: Position.Left,
                style: { top: `${(foundHandles.length + 1) * 20}px` },
            });
        }

        setHandles(foundHandles);
        console.log("lkaskfdj",handles)
    }, [text]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return (
        <NodeTemplate
            id={props.id}
            data={props.data}
            heading="Text Node"
            subheading="Handles text input"
            description="This node allows text input and dynamic variable creation."
            sourceHandles={[
                {id:`${props.id}-output`, type:"source",position:Position.Right}
            ]}
            targetHandles={[
                ...handles,
            ]}
            style={{ width: nodeDimensions.width, height: nodeDimensions.height }}
            icon="file-line"
        >
            <TextareaAutosize
                value={text}
                onChange={handleTextChange}
                minRows={3}
                style={{ width: '100%', boxSizing: 'border-box' }}
            />
        </NodeTemplate>
    );
};


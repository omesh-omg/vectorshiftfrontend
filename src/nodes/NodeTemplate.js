import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, TextField, MenuItem, IconButton, Typography, Box } from '@mui/material';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    getNodeID: state.getNodeID,
    addNode: state.addNode,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    onRemoveNode: state.onRemoveNode
});

const generateHandleStyles = (handles, position) => {
    const step = 100 / (handles.length + 1);
    return handles.map((handle, index) => ({
        ...handle,
        style: { top: `${(index + 1) * step}%` }
    }));
};

const NodeTemplate = ({
    id,
    data,
    sourceHandles = [],
    targetHandles = [],
    inputFields = [],
    description,
    heading,
    subheading,
    icon,
    children
}) => {
    const {
        nodes,
        edges,
        getNodeID,
        addNode,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onRemoveNode
    } = useStore(selector, shallow);

    const [inputValues, setInputValues] = useState(
        inputFields.reduce((acc, field) => {
            acc[field.name] = data[field.name] || '';
            return acc;
        }, {})
    );

    const handleInputChange = (e, name) => {
        setInputValues({
            ...inputValues,
            [name]: e.target.value
        });
    };

    const sourceHandlesWithStyles = generateHandleStyles(sourceHandles, Position.Right);
    const targetHandlesWithStyles = generateHandleStyles(targetHandles, Position.Left);

    return (
        <Card
            sx={{
                width: 250,
                borderRadius: 2,
                boxShadow: 3,
                padding: 2,
                position: 'relative',
                backgroundColor: '#f5f5f5',
                overflow: 'visible'
            }}
            draggable
            onDragStart={(e) => e.target.style.cursor = 'grabbing'}
            onDragEnd={(e) => e.target.style.cursor = 'grab'}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6"  sx={{ color: '#1976d2' }}>
                    {heading}
                </Typography>
                <IconButton
                    sx={{ color: '#ff9912' }}
                    onClick={() => onRemoveNode(id)}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </IconButton>
            </Box>
            {subheading && (
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {subheading}
                </Typography>
            )}
            {description && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {description}
                </Typography>
            )}
            <CardContent sx={{ padding: 0 }}>
                {inputFields.map((field, index) => (
                    <Box key={index} mb={1}>
                        <Typography variant="body2">{field.label}:</Typography>
                        {field.type === 'select' ? (
                            <select 
                            style={{width:"100%", height:"48px" , fontSize:"16px"}}
                            className="node-template-select"
                            value={inputValues[field.name]} 
                            onChange={(e) => handleInputChange(e, field.name)}
                        >
                            {field.options.map((option, optIndex) => (
                                <option key={optIndex}  style={{width:"100%", height:"48px" , fontSize:"16px"}} value={option}>{option}</option>
                            ))}
                        </select>
                        ) : (
                            <TextField
                                type={field.type}
                                fullWidth
                                value={inputValues[field.name]}
                                onChange={(e) => handleInputChange(e, field.name)}
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </Box>
                ))}
            </CardContent>
            {sourceHandles.map((handle, index) => (
                <Handle
                    key={index}
                    type="source"
                    nodeId={id}
                    position={handle.position}
                    id={`${id}-${handle.id}`}
                    style={sourceHandlesWithStyles[index].style}
                />
            ))}
            {targetHandles.map((handle, index) => (
                <Handle
                    key={index}
                    type="target"
                    position={handle.position}
                    id={`${id}-${handle.id}`}
                    style={targetHandlesWithStyles[index].style}
                />
            ))}
            {children}
        </Card>
    );
};

export default NodeTemplate;

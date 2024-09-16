import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, TextField, MenuItem, IconButton, Typography, Box } from '@mui/material';
import { shallow } from 'zustand/shallow';
import "./NodeTemplate.css";
import { height, width } from '@fortawesome/free-solid-svg-icons/fa0';
import { faRightToBracket, faChartBar, faRightFromBracket, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';


const iconMapping = {
  'right-to-bracket': faRightToBracket,
  'chart-bar': faChartBar,
  'right-from-bracket': faRightFromBracket,
  'file-line': faFileLines,
  'google': faGoogle,
  'gear':faGear,
};


const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    getNodeID: state.getNodeID,
    addNode: state.addNode,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    onRemoveNode: state.onRemoveNode,
    updateNodeField: state.updateNodeField
});

const generateHandleStyles = (handles, position) => {
    const step = 100 / (handles.length + 1);
    return handles.map((handle, index) => ({
        ...handle,
        style: { top: `${(index + 1) * step}%`,
        transform: 'scale(2)'
      }
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
    children,
}) => {
    const {
        nodes,
        edges,
        getNodeID,
        addNode,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onRemoveNode,
        updateNodeField
    } = useStore(selector, shallow);

    const [inputValues, setInputValues] = useState(
        inputFields.reduce((acc, field) => {
            acc[field.name] = data[field.name] || '';
            return acc;
        }, {})
    );

    const selectedIcon= iconMapping[icon];

    const handleInputChange = (e, name) => {
        setInputValues({
            ...inputValues,
            [name]: e.target.value
        });
        updateNodeField(id,name,e.target.value);
    };

    const sourceHandlesWithStyles = generateHandleStyles(sourceHandles, Position.Right);
    const targetHandlesWithStyles = generateHandleStyles(targetHandles, Position.Left);
    console.log(selectedIcon,"selectedicon");
    return (
        <Card
            sx={{
                width: 250,
                borderRadius: 2,
                boxShadow: 3,
                padding: 2,
                position: 'relative',
                // backgroundColor: '#fffff',
                overflow: 'visible',


            }}
            className='custom-drag-handle'
            
            
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} className="custom-drag-handle" 
              onDragStart={(e) => e.target.style.cursor = 'grabbing'}
              onDragEnd={(e) => e.target.style.cursor = 'grab'}
              >
                
                <Typography variant="h6"  sx={{ color: '#1b2845',letterSpacing:"0.15rem", fontWeight: "800"  }}>
                <FontAwesomeIcon icon={selectedIcon} style={{ color: '#1b2845', marginRight: '10px' }} />                 
                    {heading}
                </Typography>
                
                <IconButton
                    sx={{ color: '#1b2845' }}
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
                            style={{width:"100%", height:"48px" , fontSize:"16px", backgroundColor:"#ffffff", border:"1px #999999 solid", borderRadius:"4px"}}
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
                    className='handle right'
                    style={sourceHandlesWithStyles[index].style}
                />
            ))}
            {targetHandles.map((handle, index) => (
                <Handle
                    key={index}
                    type="target"
                    position={handle.position}
                    id={`${id}-${handle.id}`}
                    className='handle left'
                    style={targetHandlesWithStyles[index].style}
                />
            ))}
            {children}
        </Card>
    );
};

export default NodeTemplate;

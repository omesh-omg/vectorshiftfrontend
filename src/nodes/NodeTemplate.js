// NodeTemplate.js
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const generateHandleStyles = (handles, position) => {
    const step = 100 / (handles.length +1 );
    console.log(position, handles);
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
  style,
  children
}) => {
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
    <div style={{ width: 200, border: '1px solid black', padding: 10, }}>
      {heading && <h3>{heading}</h3>}
      {subheading && <h4>{subheading}</h4>}
      {description && <p>{description}</p>}
      <div>
        {inputFields.map((field, index) => (
          <div key={index}>
            <label>
              {field.label}:
              {field.type === 'select' ? (
                <select value={inputValues[field.name]} onChange={(e) => handleInputChange(e, field.name)}>
                  {field.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type={field.type} 
                  value={inputValues[field.name]} 
                  onChange={(e) => handleInputChange(e, field.name)} 
                />
              )}
            </label>
          </div>
        ))}
      </div>
      {sourceHandles.map((handle, index) => (
        <Handle
          key={index}
          type="source"
          nodeId= "sadlfj"
          position={handle.position}
          id={`${id}-${handle.id}asddfa`}
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
    </div>
  );
};

export default NodeTemplate;

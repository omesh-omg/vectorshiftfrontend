// draggableNode.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faChartBar, faRightFromBracket, faFileLines } from '@fortawesome/free-solid-svg-icons';


const iconMapping = {
  'right-to-bracket': faRightToBracket,
  'chart-bar': faChartBar,
  'right-from-bracket': faRightFromBracket,
  'file-line': faFileLines
};

export const DraggableNode = ({ type, label,icon }) => {
  const selectedIcon= iconMapping[icon];
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    console.log(appData);
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        cursor: 'grab',
        minWidth: '100px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '8px',
        backgroundColor: '#1C2536',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #3A4A61',
        transition: 'background-color 0.3s, box-shadow 0.3s',
      }}
      draggable
    >
      <FontAwesomeIcon icon={selectedIcon} style={{ color: '#fff', marginRight: '10px' }} /> 
      <span style={{ color: '#fff', fontWeight: 'bold'}}>{label || type}</span>
    </div>
  );
};

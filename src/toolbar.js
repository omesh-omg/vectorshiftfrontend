// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' icon='right-to-bracket' />
                <DraggableNode type='llm' label='LLM' icon='chart-bar'/>
                <DraggableNode type='customOutput' label='Output' icon= 'right-from-bracket'/>
                <DraggableNode type='text' label='Text' icon ='file-line' />
            </div>
        </div>
    );
};

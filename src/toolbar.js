// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' ,boxShadow:"5px 5px 5px #F4F4F5", marginBottom:"8px"}}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' icon='right-to-bracket' />
                <DraggableNode type='customOutput' label='Output' icon= 'right-from-bracket'/>
                <DraggableNode type='llm' label='LLM' icon='chart-bar'/>
                <DraggableNode type='text' label='Text' icon ='file-line' />
                <DraggableNode type='googleLLM' label='Text' icon ='google' />
            </div>
        </div>
    );
};

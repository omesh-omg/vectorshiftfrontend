//nodeTypes.js
import { InputNode, OutputNode, TextNode, LLMNode  } from './nodes/Node';
import { GoogleLLM } from './nodes/CustomNodes';

const nodeTypes = {
    customInput: InputNode,
    llm: LLMNode,
    customOutput: OutputNode,
    text: TextNode,
    googleLLM: GoogleLLM,
  };
  
  export const addNodeTypes = (name, component) => {
    nodeTypes[name] = component;
  };
  export default nodeTypes;
  
 
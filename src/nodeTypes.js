//nodeTypes.js
import { InputNode, OutputNode, TextNode, LLMNode } from './nodes/Node';

const nodeTypes = {
    customInput: InputNode,
    llm: LLMNode,
    customOutput: OutputNode,
    text: TextNode,
  };
  
  export const addNodeTypes = (name, component) => {
    nodeTypes[name] = component;
  };
  export default nodeTypes;
  
 
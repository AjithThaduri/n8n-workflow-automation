// src/nodes/TriggerNode.tsx

import { Handle, Position, NodeProps } from 'reactflow';
import { Zap } from 'lucide-react'; // Using a 'zap' icon for triggers

export function TriggerNode({ data }: NodeProps<{ label: string }>) {
  return (
    <div className="bg-green-900/50 border border-green-500 rounded-lg shadow-xl w-64">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-green-400" />
          <div className="text-gray-200 font-medium">{data.label}</div>
        </div>
      </div>

      {/* A trigger node only has a source handle to start the flow */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-green-400 !w-3 !h-3"
      />
    </div>
  );
}
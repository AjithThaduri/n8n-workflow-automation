import { Handle, Position, type NodeProps } from 'reactflow';
import { Terminal } from 'lucide-react';

export function LogNode({ data }: NodeProps<{ label: string }>) {
  return (
    <div className="bg-gray-700 border border-gray-500 rounded-lg shadow-xl w-64">
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3" />
      <div className="p-4 flex items-center gap-3">
        <Terminal className="w-5 h-5 text-gray-300" />
        <div className="text-gray-200 font-medium">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-3 !h-3" />
    </div>
  );
}
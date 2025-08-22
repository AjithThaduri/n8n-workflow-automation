import { Handle, Position, type NodeProps } from 'reactflow';
import { GitFork } from 'lucide-react';

export function LogicNode({ data }: NodeProps<{ label: string }>) {
  return (
    <div className="bg-purple-900/50 border border-purple-500 rounded-lg shadow-xl w-64 relative px-4 py-2">
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3" />
      <div className="flex items-center gap-3">
        <GitFork className="w-5 h-5 text-purple-400" />
        <div className="text-gray-200 font-medium">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} id="true" className="!bg-green-500 !w-3 !h-3" style={{ top: '33%' }} />
      <div className="absolute text-green-400 text-xs font-bold" style={{ top: '33%', right: '1.5rem', transform: 'translateY(-50%)' }}>TRUE</div>
      <Handle type="source" position={Position.Right} id="false" className="!bg-red-500 !w-3 !h-3" style={{ top: '66%' }} />
      <div className="absolute text-red-400 text-xs font-bold" style={{ top: '66%', right: '1.5rem', transform: 'translateY(-50%)' }}>FALSE</div>
    </div>
  );
}
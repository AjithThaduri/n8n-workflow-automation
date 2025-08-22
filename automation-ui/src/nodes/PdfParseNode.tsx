import { Handle, Position, type NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';

export function PdfParseNode({ data }: NodeProps<{ label: string }>) {
  return (
    <div className="bg-orange-900/50 border border-orange-500 rounded-lg shadow-xl w-64">
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3" />
      <div className="p-4 flex items-center gap-3">
        <FileText className="w-5 h-5 text-orange-400" />
        <div className="text-gray-200 font-medium">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-3 !h-3" />
    </div>
  );
}
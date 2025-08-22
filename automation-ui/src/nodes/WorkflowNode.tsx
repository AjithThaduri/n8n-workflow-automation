import { Handle, Position, type NodeProps } from 'reactflow';
import { Mail, MessageSquare } from 'lucide-react';

const iconMap = {
  email: <Mail className="w-5 h-5 text-gray-300" />,
  sms: <MessageSquare className="w-5 h-5 text-gray-300" />,
};

export function WorkflowNode({ data }: NodeProps<{ label: string; type: keyof typeof iconMap }>) {
  const icon = iconMap[data.type] || null;

  return (
    <div className="bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-xl w-64">
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3" />
      <div className="p-4">
        <div className="flex items-center gap-3">
          {icon}
          <div className="text-gray-200 font-medium">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-3 !h-3" />
    </div>
  );
}
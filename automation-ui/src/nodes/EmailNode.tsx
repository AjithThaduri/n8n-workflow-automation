import { Handle, Position, type NodeProps } from 'reactflow';
import { Mail } from 'lucide-react';
import { useCallback } from 'react';

// Corrected type definition
export function EmailNode({ data, id, setNodes }: NodeProps<{ label: string; recipient: string; }> & { setNodes: Function }) {
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRecipient = event.target.value;
      setNodes((nds: any[]) =>
        nds.map((node) => {
          if (node.id === id) {
            node.data = { ...node.data, recipient: newRecipient };
          }
          return node;
        }),
      );
    },
    [id, setNodes],
  );

  return (
    <div className="bg-red-900/50 border border-red-500 rounded-lg shadow-xl w-64">
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3" />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="w-5 h-5 text-red-400" />
          <div className="text-gray-200 font-medium">{data.label}</div>
        </div>
        
        <input 
          type="email" 
          placeholder="Recipient email"
          value={data.recipient || ''}
          onChange={handleInputChange}
          className="w-full text-sm p-2 bg-red-900/70 border border-red-500 text-white rounded-md nodrag"
        />
      </div>
    </div>
  );
}
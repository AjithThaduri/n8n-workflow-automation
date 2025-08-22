// src/components/Sidebar.tsx

const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
  event.dataTransfer.setData('application/reactflow/type', nodeType);
  event.dataTransfer.setData('application/reactflow/label', label);
  event.dataTransfer.effectAllowed = 'move';
};

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#222222] p-4 border-r border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Blocks</h2>
      
      {/* Trigger Node - on a real app, this would not be draggable */}
      <div 
        className="bg-green-900/50 border border-green-500 rounded-lg p-3 text-white cursor-grab mb-2 flex justify-center" 
        onDragStart={(event) => onDragStart(event, 'trigger', 'On Form Submission')} 
        draggable
      >
        On Form Submission
      </div>

      {/* Logic Node */}
      <div 
        className="bg-purple-900/50 border border-purple-500 rounded-lg p-3 text-white cursor-grab mb-2 flex justify-center" 
        onDragStart={(event) => onDragStart(event, 'logic', 'If/Else Condition')} 
        draggable
      >
        If / Else
      </div>
      
      {/* AI Node */}
      <div 
        className="bg-blue-900/50 border border-blue-500 rounded-lg p-3 text-white cursor-grab mb-2 flex justify-center" 
        onDragStart={(event) => onDragStart(event, 'ai', 'AI Summarize Text')} 
        draggable
      >
        AI Summary
      </div>
      
      {/* Action Nodes */}
      <div 
        className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-3 text-white cursor-grab mb-2 flex justify-center" 
        onDragStart={(event) => onDragStart(event, 'workflow', 'Send Email')} 
        draggable
      >
        Send Email
      </div>
      <div 
        className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-3 text-white cursor-grab mb-2 flex justify-center" 
        onDragStart={(event) => onDragStart(event, 'workflow', 'Send SMS')} 
        draggable
      >
        Send SMS
      </div>

      {/* Utility/Data Nodes */}
      <div 
        className="bg-gray-700 border border-gray-500 rounded-lg p-3 text-white cursor-grab mb-2 flex justify-center" 
        onDragStart={(event) => onDragStart(event, 'log', 'Log to Console')} 
        draggable
      >
        Log Message
      </div>

      <div 
        className="bg-orange-900/50 border border-orange-500 rounded-lg p-3 text-white cursor-grab mb-2 flex justify-center" 
        onDragStart={(event) => onDragStart(event, 'pdfParse', 'Parse PDF')} 
        draggable
      >
        Parse PDF
      </div>
    </aside>
  );
}
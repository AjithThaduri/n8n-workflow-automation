import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

// All the custom node components
import { PdfParseNode } from './nodes/PdfParseNode';
import { EmailNode } from './nodes/EmailNode';
import { AiNode } from './nodes/AiNode';
import { LogNode } from './nodes/LogNode';
import { TriggerNode } from './nodes/TriggerNode';
import { LogicNode } from './nodes/LogicNode';
import { Sidebar } from './components/Sidebar';
import { WorkflowNode } from './nodes/WorkflowNode';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    data: { label: 'On Form Submission' },
    position: { x: 250, y: 150 },
  },
];

let id = 2;
const getUniqueId = () => `${id++}`;

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, toObject } = useReactFlow();

  // State for the last saved workflow ID and the dynamic PDF URL
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      logic: LogicNode,
      log: LogNode,
      ai: AiNode,
      pdfParse: PdfParseNode,
      workflow: WorkflowNode,
      email: (props: any) => <EmailNode {...props} setNodes={setNodes} />,
    }),
    [setNodes]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#cbd5e1', strokeWidth: 2 } }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow/type');
      if (!type) return;
      
      const label = event.dataTransfer.getData('application/reactflow/label');
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const data = { label, ...(type === 'email' && { recipient: '' }) };
      const newNode: Node = { id: getUniqueId(), type, position, data };
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );
  
  const onSave = useCallback(async () => {
    const flow = toObject();
    const emailNode = flow.nodes.find((node) => node.type === 'email');
    const recipientEmail = emailNode?.data.recipient || '';

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow: flow, email: recipientEmail }),
      });

      if (response.ok) {
        const result = await response.json();
        const newId = result.data?.[0]?.id;
        if (newId) {
          setCurrentWorkflowId(newId);
          alert(`Workflow saved successfully! ID: ${newId}`);
        } else {
          alert('Workflow saved, but ID was not returned.');
        }
      } else {
        alert(`Failed to save workflow. Server responded with ${response.status}`);
      }
    } catch (error) {
      alert('Could not connect to the server.');
    }
  }, [toObject]);
  
  // onRun now uses the dynamic PDF URL from the input field
  const onRun = useCallback(async () => {
    if (!currentWorkflowId) {
      alert('Please save the workflow first to get an ID.');
      return;
    }
    if (!pdfUrl) {
      alert('Please paste a PDF URL into the input field before running.');
      return;
    }
    
    const payload = { pdfUrl: pdfUrl };

    alert(`Triggering workflow ${currentWorkflowId} with your PDF...`);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/execute/${currentWorkflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Workflow executed successfully! Check your server logs and email.');
      } else {
        alert('Workflow execution failed.');
      }
    } catch (error) {
      alert('An error occurred while triggering the workflow.');
    }
  }, [currentWorkflowId, pdfUrl]);


  return (
    <div className="flex-grow h-full flex flex-col relative">
      {/* UI for Workflow ID and PDF URL Input */}
      <div className="absolute top-4 left-4 z-10 p-2 bg-[#222222] border border-gray-700 text-white rounded-lg w-1/3">
          <div className="text-sm mb-2">
            Current Workflow ID: <span className="font-bold text-green-400">{currentWorkflowId || 'None (Save to get ID)'}</span>
          </div>
          <input 
            type="text"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="Paste PDF URL here to trigger workflow..."
            className="w-full p-2 bg-[#1a1a1a] border border-gray-600 text-white rounded-md text-sm"
          />
      </div>
      
      <div className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background />
          <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                  onClick={onRun}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                  Run
              </button>
              <button 
                  onClick={onSave} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                  Save
              </button>
          </div>
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-[#1a1a1a]">
      <ReactFlowProvider>
        <Sidebar />
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
}
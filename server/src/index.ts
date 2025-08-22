// server/src/index.ts

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import axios from 'axios';
import pdf from 'pdf-parse';

dotenv.config();

// --- Initialization & Clients ---
const app = express();
const PORT = 8080;
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

// --- API Endpoints ---

app.post('/api/save', async (req, res) => {
    const { workflow, email } = req.body;
    console.log('Received workflow and email, attempting to save to Supabase...');

    try {
        const { data, error } = await supabase
            .from('workflows')
            .insert([
                { data: workflow, email: email },
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error.message);
            return res.status(500).json({ message: 'Failed to save workflow.', error: error.message });
        }

        console.log('✅ Workflow and email saved successfully:', data);
        res.status(200).json({ message: 'Workflow saved successfully!', data });
    } catch (error: any) {
        console.error('Unexpected server error:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

app.post('/api/execute/:workflowId', async (req, res) => {
    const { workflowId } = req.params;
    const initialData = req.body;
    
    console.log(`--- Execution triggered for workflow ID: ${workflowId} ---`);

    try {
        const { data: workflow, error } = await supabase.from('workflows').select('data, email').eq('id', workflowId).single();
        if (error || !workflow) { 
            return res.status(404).json({ message: `Workflow with ID ${workflowId} not found.` });
        }

        const parsedData = JSON.parse(JSON.stringify(workflow.data));
        const { nodes, edges } = parsedData;
        
        const nodeMap = new Map(nodes.map((node:any) => [node.id, node]));
        const edgeMap = new Map(edges.map((edge:any) => [edge.source, edge]));
        const triggerNode = nodes.find((node:any) => node.type === 'trigger');
        if (!triggerNode) { 
            return res.status(400).json({ message: 'Workflow has no trigger node.' });
        }

        let currentNode: any = triggerNode;
        let currentData: any = initialData;
        const executionLogs: any[] = [];

        while (currentNode) {
            const nodeLabel = currentNode.data.label;
            console.log(`Executing node: ${nodeLabel}`);
            executionLogs.push(`Executing node: ${nodeLabel}`);

            switch (currentNode.type) {
                case 'log':
                    console.log('LOGGED DATA:', currentData);
                    executionLogs.push(JSON.stringify(currentData, null, 2));
                    break;

                case 'pdfParse':
                    if (!currentData.pdfUrl) {
                        throw new Error("PDF Parse node requires a 'pdfUrl' field in the input data.");
                    }
                    const pdfResponse = await axios.get(currentData.pdfUrl, { responseType: 'arraybuffer' });
                    const pdfBuffer = pdfResponse.data;
                    const pdfData = await pdf(pdfBuffer);
                    currentData = { text: pdfData.text };
                    console.log('PDF Text Extracted.');
                    executionLogs.push(`PDF Text Extracted. Length: ${pdfData.text.length}`);
                    break;

                case 'ai':
                    if (!currentData.text) {
                        throw new Error("AI node requires a 'text' field in the input data.");
                    }
                    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
                    const prompt = `Please provide a concise, one-paragraph summary of the following text:\n\n${currentData.text}`;
                    const result = await model.generateContent(prompt);
                    const summary = result.response.text();
                    currentData = { summary: summary };
                    console.log('AI Summary Generated.');
                    executionLogs.push(`AI Summary: ${summary}`);
                    break;

                case 'email':
                    const recipientEmail = 'ajiththaduri1@gmail.com'; // FINAL FIX: Hardcode the email
                    
                    if (!currentData.summary) {
                        throw new Error("Email node requires a 'summary'.");
                    }
                    try {
                        const { data, error } = await resend.emails.send({
                            from: 'Workflow Automation <hello@resend.dev>',
                            to: [recipientEmail],
                            subject: `Summary from your workflow!`,
                            html: `<h1>AI Summary</h1><p>${currentData.summary}</p>`,
                        });

                        if (error) {
                            throw new Error(`Resend API Error: ${error.message}`);
                        }
                        console.log('Email Sent.');
                        currentData = { status: 'Email Sent' };
                    } catch (error: any) {
                        throw new Error(`Resend API Error: ${error.message}`);
                    }
                    
                    break;

                case 'logic':
                    let conditionMet = false;
                    if (currentData.status === 'success') {
                        conditionMet = true;
                    }
                    console.log(`Condition check: ${conditionMet ? 'TRUE' : 'FALSE'}`);
                    const outgoingEdgeId = conditionMet ? 'true' : 'false';
                    const logicOutgoingEdge = edges.find((edge:any) => edge.source === currentNode.id && edge.sourceHandle === outgoingEdgeId);
                    if (logicOutgoingEdge) {
                        const nextNode = nodeMap.get(logicOutgoingEdge.target);
                        if (nextNode) {
                            currentNode = nextNode;
                        } else {
                            currentNode = null;
                        }
                    } else {
                        currentNode = null;
                    }
                    continue;
            }

            const outgoingEdge = edges.find((edge:any) => edge.source === currentNode.id && !edge.sourceHandle);
            if (outgoingEdge) {
                currentNode = nodeMap.get(outgoingEdge.target)!;
            } else {
                currentNode = null;
            }
        }
        
        console.log('--- ✅ Workflow Execution Finished ---');
        res.status(200).json({ 
            message: 'Workflow executed successfully.',
            logs: executionLogs,
            finalOutput: currentData
        });

    } catch (error: any) {
        console.error(`--- ❌ Execution failed for workflow ID: ${workflowId} ---`, error);
        res.status(500).json({ message: 'An error occurred during execution.', error: error.message });
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
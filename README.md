# Visual Workflow Automation Platform

A visual, drag-and-drop workflow automation platform similar to n8n, built as a prerequisite for a technical interview. This application allows users to design complex workflows, save them to a database, and execute them in real-time.

**Live Demo URL:** [**Your Vercel Link Will Go Here**]

---

## ✨ Core Features

-   **Visual Node-Based Editor**: A dynamic canvas built with React Flow for creating and connecting workflow nodes.
-   **Diverse Node Library**: Includes trigger, action (AI Summary, Send Email), and logic (If/Else) nodes.
-   **Real-Time Execution Engine**: A backend engine that dynamically interprets and executes saved workflows.
-   **AI Integration**: A dedicated node to summarize text using the Google Gemini API.
-   **Database Persistence**: Workflows are saved to a PostgreSQL database (managed via Supabase).
-   **Interactive UI**: Users can configure nodes (e.g., set recipient emails) directly on the canvas.

## 🚀 Tech Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS, React Flow
-   **Backend**: Node.js, Express, TypeScript
-   **Database**: PostgreSQL (Supabase)
-   **External APIs**: Google Gemini, Resend (for emails)

## ⚙️ How to Run Locally

**1. Clone the repository:**
```bash
git clone [https://github.com/your-username/visual-workflow-automation.git](https://github.com/your-username/visual-workflow-automation.git)
cd visual-workflow-automation

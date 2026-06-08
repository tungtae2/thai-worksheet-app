# Thai Worksheet Automation Platform

A localhost-first educational automation platform designed to automatically generate Thai language worksheets for primary school students (Grades P1-P6) using AI. 

Built with a custom JSON-based Workflow Engine, an Express backend, and a vibrant Next.js frontend dashboard.

## Features
- **Workflow Engine**: Custom file-based workflow runner similar to n8n.
- **AI Content Generation**: Powered by Google Gemini (with adapter pattern for Claude/OpenAI in the future).
- **Multi-format Export**: Generates worksheets in **TXT**, **DOCX**, and **PDF** (with native Thai font support).
- **Next.js Dashboard**: A premium, glassmorphism-styled UI to trigger workflows and view logs.
- **Curriculum Aligned**: Designed specifically for Thai primary education.

## Project Structure
```
thai-worksheet-automation/
├── backend/
│   ├── data/                 # Generated PDF/DOCX/TXT files and Fonts
│   ├── logs/                 # Execution history JSON logs
│   ├── src/
│   │   ├── api/routes.js     # Express API routes
│   │   ├── engine/engine.js  # Core workflow executor
│   │   ├── services/         # AI providers and Exporters
│   │   ├── steps/            # Workflow node implementations
│   │   └── server.js         # Backend entrypoint
│   └── workflows/            # JSON workflow definitions
└── frontend/                 # Next.js App Router Dashboard
```

## Installation Guide

### Prerequisites
- Node.js v18+
- A Google Gemini API Key

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your API Key:
   Open `backend/.env` and ensure your `GEMINI_API_KEY` is set.
   ```env
   GEMINI_API_KEY=your_key_here
   ```

### 2. Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Platform

You need to run both the backend server and the frontend Next.js server simultaneously.

**Terminal 1 (Backend):**
```bash
cd backend
node src/server.js
```
*Runs on http://localhost:3001*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Runs on http://localhost:3000*

Once both are running, open your browser to `http://localhost:3000` to access the Thai Worksheet Automation dashboard!

## Creating New Workflows
To create a new workflow, simply add a new JSON file to the `backend/workflows/` directory. The dashboard will automatically detect it. Use `backend/workflows/worksheet_generation.json` as a template.

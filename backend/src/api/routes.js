const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');

const WorkflowEngine = require('../engine/engine');
const InputStep = require('../steps/input-step');
const AIGenerateStep = require('../steps/ai-generate-step');
const FormatStep = require('../steps/format-step');
const ExportStep = require('../steps/export-step');

// Initialize Engine
const engine = new WorkflowEngine();
engine.registerStep('input', InputStep);
engine.registerStep('ai_generate', AIGenerateStep);
engine.registerStep('format', FormatStep);
engine.registerStep('export', ExportStep);

// GET /curriculum
router.get('/curriculum', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../../data/curriculum.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.json({ subjects: [] });
        }
        res.status(500).json({ error: error.message });
    }
});

// GET /workflows
router.get('/workflows', async (req, res) => {
    try {
        const workflowsDir = path.join(__dirname, '../../workflows');
        const files = await fs.readdir(workflowsDir);
        
        const workflows = [];
        for (const file of files) {
            if (file.endsWith('.json') && !file.startsWith('temp_')) {
                const data = await fs.readFile(path.join(workflowsDir, file), 'utf-8');
                const parsed = JSON.parse(data);
                // We map filename to use it as an ID for executing
                parsed.filename = file.replace('.json', '');
                workflows.push(parsed);
            }
        }
        res.json(workflows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /workflows/:filename/execute
router.post('/workflows/:filename/execute', async (req, res) => {
    try {
        const filename = req.params.filename;
        const workflowPath = path.join(__dirname, `../../workflows/${filename}.json`);
        
        const workflowData = JSON.parse(await fs.readFile(workflowPath, 'utf-8'));
        
        // Find input step and override params with req.body
        const inputStep = workflowData.steps.find(s => s.type === 'input');
        if (inputStep && req.body) {
            inputStep.params = { ...inputStep.params, ...req.body };
        }

        const tempPath = path.join(__dirname, `../../workflows/temp_${Date.now()}.json`);
        await fs.writeFile(tempPath, JSON.stringify(workflowData), 'utf-8');

        // Execute
        const result = await engine.execute(tempPath);
        
        // Cleanup
        await fs.unlink(tempPath);

        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /logs
router.get('/logs', async (req, res) => {
    try {
        const logsDir = path.join(__dirname, '../../logs');
        const files = await fs.readdir(logsDir);
        files.sort().reverse(); // newest first
        
        const logs = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const data = await fs.readFile(path.join(logsDir, file), 'utf-8');
                logs.push({ file, data: JSON.parse(data) });
            }
        }
        res.json(logs);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.json([]);
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

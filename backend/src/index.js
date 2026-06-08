require('dotenv').config();
const path = require('path');

const WorkflowEngine = require('./engine/engine');
const InputStep = require('./steps/input-step');
const AIGenerateStep = require('./steps/ai-generate-step');
const FormatStep = require('./steps/format-step');
const ExportStep = require('./steps/export-step');

async function main() {
    const engine = new WorkflowEngine();
    
    // Register step types
    engine.registerStep('input', InputStep);
    engine.registerStep('ai_generate', AIGenerateStep);
    engine.registerStep('format', FormatStep);
    engine.registerStep('export', ExportStep);

    // Run example workflow
    const workflowPath = path.join(__dirname, '../workflows/worksheet_generation.json');
    
    try {
        const result = await engine.execute(workflowPath);
        console.log("Final Context Outputs:", JSON.stringify(result.outputs, null, 2));
    } catch (err) {
        console.error("Fatal Error:", err);
    }
}

main();

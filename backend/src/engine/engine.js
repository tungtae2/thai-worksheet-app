const fs = require('fs/promises');
const path = require('path');

class WorkflowEngine {
    constructor() {
        this.stepRegistry = new Map();
    }

    registerStep(type, StepClass) {
        this.stepRegistry.set(type, StepClass);
    }

    async loadWorkflow(workflowPath) {
        const data = await fs.readFile(workflowPath, 'utf-8');
        return JSON.parse(data);
    }

    async execute(workflowPath) {
        try {
            const workflow = await this.loadWorkflow(workflowPath);
            console.log(`Starting workflow: ${workflow.name} (${workflow.id})`);
            
            let context = {
                workflowId: workflow.id,
                outputs: {}
            };

            for (const stepConfig of workflow.steps) {
                console.log(`Executing step: ${stepConfig.id} (${stepConfig.type})`);
                
                const StepClass = this.stepRegistry.get(stepConfig.type);
                if (!StepClass) {
                    throw new Error(`Unregistered step type: ${stepConfig.type}`);
                }

                const stepInstance = new StepClass(stepConfig);
                const result = await stepInstance.execute(context);
                
                context.outputs[stepConfig.id] = result;
            }

            console.log('Workflow executed successfully.');
            
            // Save execution log
            const logEntry = {
                timestamp: new Date().toISOString(),
                workflowId: workflow.id,
                status: 'SUCCESS',
                context: context
            };
            const logPath = path.join(__dirname, '../../../logs', `${workflow.id}_${Date.now()}.log.json`);
            await fs.mkdir(path.dirname(logPath), { recursive: true });
            await fs.writeFile(logPath, JSON.stringify(logEntry, null, 2), 'utf-8');

            return context;
        } catch (error) {
            console.error('Workflow execution failed:', error.message);
            
            // Try to log the failure
            try {
                const logEntry = {
                    timestamp: new Date().toISOString(),
                    status: 'FAILED',
                    error: error.message,
                    stack: error.stack
                };
                const logPath = path.join(__dirname, '../../../logs', `error_${Date.now()}.log.json`);
                await fs.mkdir(path.dirname(logPath), { recursive: true });
                await fs.writeFile(logPath, JSON.stringify(logEntry, null, 2), 'utf-8');
            } catch (logErr) {
                console.error("Failed to write error log", logErr);
            }

            throw error;
        }
    }
}

module.exports = WorkflowEngine;

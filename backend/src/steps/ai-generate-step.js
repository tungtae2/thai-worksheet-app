const BaseStep = require('./base-step');
const GeminiAdapter = require('../services/ai/gemini-adapter');

class AIGenerateStep extends BaseStep {
    async execute(context) {
        const inputStepId = this.params.inputStepId;
        const inputs = context.outputs[inputStepId];
        
        if (!inputs) {
            throw new Error(`AIGenerateStep requires inputs from step ${inputStepId}`);
        }

        let provider;
        if (this.params.provider === 'gemini') {
            provider = new GeminiAdapter();
        } else {
            throw new Error(`Unsupported AI provider: ${this.params.provider}`);
        }

        console.log(`Generating content using ${this.params.provider}...`);
        const result = await provider.generateWorksheet(inputs);
        return result;
    }
}

module.exports = AIGenerateStep;

const BaseStep = require('./base-step');

class FormatStep extends BaseStep {
    async execute(context) {
        const aiStepId = this.params.aiStepId;
        const aiData = context.outputs[aiStepId];

        if (!aiData) {
            throw new Error(`FormatStep requires inputs from step ${aiStepId}`);
        }

        // Find indicator code from any input step if it exists in context
        let indicatorCode = null;
        for (const stepId in context.outputs) {
            if (context.outputs[stepId]?.indicatorCode) {
                indicatorCode = context.outputs[stepId].indicatorCode;
                break;
            }
        }

        console.log(`Formatting worksheet data...`);
        return {
            ...aiData,
            indicatorCode,
            formattedDate: new Date().toISOString()
        };
    }
}

module.exports = FormatStep;

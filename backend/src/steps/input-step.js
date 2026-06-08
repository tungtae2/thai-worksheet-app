const BaseStep = require('./base-step');

class InputStep extends BaseStep {
    async execute(context) {
        // In a real system, this might block to wait for user input.
        // Here, it just outputs its params to the context.
        return {
            grade: this.params.grade,
            topic: this.params.topic,
            questionCount: this.params.questionCount,
            type: this.params.type
        };
    }
}

module.exports = InputStep;

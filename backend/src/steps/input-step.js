const BaseStep = require('./base-step');

class InputStep extends BaseStep {
    async execute(context) {
        // Return all params passed from the frontend request
        return this.params;
    }
}

module.exports = InputStep;

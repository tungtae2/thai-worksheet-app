class BaseStep {
    constructor(config) {
        this.id = config.id;
        this.type = config.type;
        this.params = config.params || {};
    }

    async execute(context) {
        throw new Error("Execute method must be implemented by subclass");
    }
}

module.exports = BaseStep;

const fs = require('fs/promises');
const path = require('path');

class BankRetrieveStep {
    constructor(config) {
        this.config = config;
    }

    async execute(context) {
        const inputs = this.config.inputs || {};
        
        let subjectId = null;
        let grade = null;
        let chapterCode = null;
        let worksheetType = null;
        let questionCount = 10;

        // Resolve inputs from context
        if (inputs.subjectId) {
            const parts = inputs.subjectId.split('.');
            if (parts.length === 2 && context.outputs[parts[0]]) {
                subjectId = context.outputs[parts[0]][parts[1]];
            }
        }
        if (inputs.grade) {
            const parts = inputs.grade.split('.');
            if (parts.length === 2 && context.outputs[parts[0]]) {
                grade = context.outputs[parts[0]][parts[1]];
            }
        }
        if (inputs.chapterCode) {
            const parts = inputs.chapterCode.split('.');
            if (parts.length === 2 && context.outputs[parts[0]]) {
                chapterCode = context.outputs[parts[0]][parts[1]];
            }
        }
        if (inputs.worksheetType) {
            const parts = inputs.worksheetType.split('.');
            if (parts.length === 2 && context.outputs[parts[0]]) {
                worksheetType = context.outputs[parts[0]][parts[1]];
            }
        }
        if (inputs.questionCount) {
            const parts = inputs.questionCount.split('.');
            if (parts.length === 2 && context.outputs[parts[0]]) {
                questionCount = parseInt(context.outputs[parts[0]][parts[1]], 10) || 10;
            }
        }

        console.log(`[BankRetrieveStep] Retrieving for: ${subjectId} / ${grade} / ${chapterCode} / ${worksheetType}`);

        try {
            const bankPath = path.join(__dirname, '../../data/question_bank.json');
            const bankData = JSON.parse(await fs.readFile(bankPath, 'utf-8'));

            if (!bankData[subjectId] || !bankData[subjectId][grade] || !bankData[subjectId][grade][chapterCode] || !bankData[subjectId][grade][chapterCode][worksheetType]) {
                throw new Error(`Data not found in question bank for ${subjectId} / ${grade} / ${chapterCode} / ${worksheetType}. Please run generate_bank.js first.`);
            }

            const availableItems = bankData[subjectId][grade][chapterCode][worksheetType];
            
            // Assume format { questions: [...] } or { matches: [...] }
            let itemsKey = "questions";
            let rawItems = [];
            
            if (availableItems.questions) {
                itemsKey = "questions";
                rawItems = availableItems.questions;
            } else if (availableItems.matches) {
                itemsKey = "matches";
                rawItems = availableItems.matches;
            }

            if (!rawItems || rawItems.length === 0) {
                 throw new Error("Empty items in question bank.");
            }

            // Shuffle and pick
            const shuffled = [...rawItems].sort(() => 0.5 - Math.random());
            const selectedItems = shuffled.slice(0, questionCount);

            return { [itemsKey]: selectedItems };

        } catch (error) {
            console.error("[BankRetrieveStep] Error:", error);
            throw error;
        }
    }
}

module.exports = BankRetrieveStep;

const fs = require('fs/promises');
const path = require('path');

class TXTExporter {
    async export(data, outputPath) {
        let content = `========================================================\n`;
        content += `TITLE: ${data.title}\n`;
        content += `DATE: ${data.formattedDate}\n`;
        content += `========================================================\n\n`;
        
        content += `INSTRUCTIONS:\n${data.instructions}\n\n`;
        
        content += `LEARNING OBJECTIVES:\n`;
        data.learningObjectives.forEach(obj => {
            content += `- ${obj}\n`;
        });
        content += `\n`;
        
        content += `QUESTIONS:\n`;
        data.questions.forEach((q, index) => {
            content += `${index + 1}. ${q.q}\n`;
            content += `   [ ] ___________________________________________________\n\n`;
        });

        content += `\n========================================================\n`;
        content += `ANSWER KEY:\n`;
        data.questions.forEach((q, index) => {
            content += `${index + 1}. ${q.a}\n`;
        });

        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, content, 'utf-8');
        return outputPath;
    }
}

module.exports = TXTExporter;

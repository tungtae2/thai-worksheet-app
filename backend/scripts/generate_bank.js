require('dotenv').config({ path: __dirname + '/../.env' });
const fs = require('fs');
const path = require('path');
const GeminiAdapter = require('../src/services/ai/gemini-adapter');

const QUESTION_BANK_PATH = path.join(__dirname, '../data/question_bank.json');

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log("Usage: node generate_bank.js <subjectId> <grade> <chapterCode>");
        console.log("Example: node generate_bank.js thai_phatee P1 \"บทที่ 1\"");
        process.exit(1);
    }

    const subjectId = args[0];
    const grade = args[1];
    const chapterCode = args[2];
    const types = ["copy_words", "matching", "reading_comp"]; // Simplified types for demo
    const itemsPerType = 15; // Generate 15 items

    console.log(`Starting bank generation for ${subjectId} - ${grade} - ${chapterCode}`);

    const adapter = new GeminiAdapter();

    let bank = {};
    if (fs.existsSync(QUESTION_BANK_PATH)) {
        bank = JSON.parse(fs.readFileSync(QUESTION_BANK_PATH, 'utf-8'));
    }

    if (!bank[subjectId]) bank[subjectId] = {};
    if (!bank[subjectId][grade]) bank[subjectId][grade] = {};
    if (!bank[subjectId][grade][chapterCode]) bank[subjectId][grade][chapterCode] = {};

    for (const type of types) {
        console.log(`Generating ${itemsPerType} items for type: ${type}...`);
        try {
            const promptParams = {
                topic: "Lesson Review",
                grade,
                indicatorCode: chapterCode,
                indicatorDescription: "",
                type,
                questionCount: itemsPerType
            };
            
            const content = await adapter.generateWorksheet(promptParams);
            
            bank[subjectId][grade][chapterCode][type] = content;
            
            console.log(`✓ Successfully generated for ${type}.`);
            
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
            console.error(`✗ Failed to generate for ${type}:`, error);
        }
    }

    fs.writeFileSync(QUESTION_BANK_PATH, JSON.stringify(bank, null, 2), 'utf-8');
    console.log(`\n🎉 Question bank updated successfully!`);
}

main().catch(console.error);

const { GoogleGenAI } = require('@google/genai');
const AIProvider = require('./ai-provider');

class GeminiAdapter extends AIProvider {
    constructor() {
        super();
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    async generateWorksheet(context) {
        const { grade, topic, questionCount, type, indicatorCode, indicatorDescription } = context;

        let curriculumInstruction = "";
        if (indicatorCode && indicatorDescription) {
            if (indicatorCode.startsWith("บทที่")) {
                let explicitRules = "";
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const dbPath = path.join(__dirname, '../../../data/textbook_db.json');
                    const textbookDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
                    
                    if (textbookDb[grade] && textbookDb[grade][indicatorCode]) {
                        const lessonData = textbookDb[grade][indicatorCode];
                        explicitRules = `
            CRITICAL INSTRUCTION: You MUST ONLY use the following vocabulary words: [${lessonData.vocabulary.join(', ')}]. 
            Do not introduce complex words outside of this list.
            The grammatical focus of this worksheet is: [${lessonData.vowels.join(', ')}].`;
                    }
                } catch (e) {
                    console.error("Failed to load textbook_db:", e);
                }

                curriculumInstruction = `
            CRITICAL REQUIREMENT: This worksheet MUST be based exclusively on the vocabulary, themes, and reading content from the official Thai textbook "ภาษาพาที" (Phasa Phatee).
            Target: Grade ${grade}, ${indicatorCode} - ${indicatorDescription}
            ${explicitRules}
            Ensure that all generated questions, sentences, and vocabulary are strictly relevant to this specific lesson.
            Use the names of the main characters from the textbook (e.g., ภูผา, ใบโบก, ใบบัว, น้ำใส) as subjects in your sentences where appropriate.
            `;
            } else {
                curriculumInstruction = `
            CRITICAL REQUIREMENT: This worksheet MUST specifically evaluate the Thai Basic Education Core Curriculum Indicator: 
            [${indicatorCode}] - ${indicatorDescription}
            Ensure that ALL questions are directly aligned with this standard.
            Include the learning objectives based on this indicator.
            `;
            }
        }

        let typeInstruction = "";
        let jsonStructure = `
            {
                "title": "Worksheet Title in Thai",
                "instructions": "Clear instructions in Thai for the student",
                "learningObjectives": ["Objective 1 in Thai", "Objective 2 in Thai"],
                "type": "${type}",
                "questions": [
                    { "q": "Question text in Thai", "a": "Answer text in Thai" }
                ]
            }`;

        switch(type) {
            case 'copy_words':
                typeInstruction = "Provide a list of vocabulary words. The student will practice copying them. 'q' is the word, 'a' should be left empty.";
                break;
            case 'make_sentences':
                typeInstruction = "Provide a list of vocabulary words. The student will use each word to make a sentence. 'q' is the word, 'a' should be left empty.";
                break;
            case 'fill_sentences':
                typeInstruction = "Provide sentences with one missing word replaced by '______'. Also provide a 'wordBank' array containing all the missing words in random order.";
                jsonStructure = `
            {
                "title": "Worksheet Title in Thai",
                "instructions": "Clear instructions in Thai for the student",
                "learningObjectives": ["Objective 1 in Thai", "Objective 2 in Thai"],
                "type": "${type}",
                "wordBank": ["Word1", "Word2", "Word3"],
                "questions": [
                    { "q": "Sentence with ______", "a": "The missing word" }
                ]
            }`;
                break;
            case 'write_pronunciation':
                typeInstruction = "Provide a list of difficult words. The student must write how to pronounce them. 'q' is the word, 'a' is the correct pronunciation (e.g., ภูมิใจ -> พูม-ไจ).";
                break;
            case 'matching':
                typeInstruction = "Provide words and their definitions for students to match. 'q' is the word, 'a' is the definition.";
                break;
        }

        const prompt = `
            You are an expert Thai primary school teacher (Grade P1-P6).
            Your task is to create a worksheet for Grade ${grade}.
            Topic: ${topic}
            Type: ${type}
            Number of questions: ${questionCount}

            FORMAT INSTRUCTIONS:
            ${typeInstruction}

            ${curriculumInstruction}

            Output ONLY a raw JSON object with this exact structure:
            ${jsonStructure}
            Do not wrap in markdown tags like \`\`\`json. Return only the JSON.
        `;
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        temperature: 0.7
                    }
                });

                const text = response.text;
                const jsonText = text.replace(/```json\n?|\n?```/g, '').trim();
                return JSON.parse(jsonText);
            } catch (error) {
                if (error.status === 503 && attempt < maxRetries) {
                    console.log(`[Attempt ${attempt}] Gemini API is busy (503). Retrying in 3 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
                    continue;
                }
                throw error;
            }
        }
    }
}

module.exports = GeminiAdapter;

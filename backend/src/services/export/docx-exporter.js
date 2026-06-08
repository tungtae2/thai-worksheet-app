const docx = require('docx');
const fs = require('fs/promises');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;

class DOCXExporter {
    async export(data, outputPath) {
        const children = [
            new Paragraph({
                text: data.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 }
            }),
            new Paragraph({
                text: "ชื่อ-สกุล _____________________________________________ ชั้น ___________ เลขที่ _______",
                spacing: { after: 300 }
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "คำชี้แจง: ", bold: true }),
                    new TextRun(data.instructions)
                ],
                spacing: { after: 200 }
            })
        ];

        if (data.learningObjectives && data.learningObjectives.length > 0) {
            children.push(new Paragraph({
                children: [new TextRun({ text: "จุดประสงค์การเรียนรู้:", bold: true })],
                spacing: { after: 100 }
            }));
            data.learningObjectives.forEach(obj => {
                children.push(new Paragraph({
                    text: `- ${obj}`,
                    bullet: { level: 0 }
                }));
            });
            children.push(new Paragraph({ text: "", spacing: { after: 200 } })); // spacer
        }

        children.push(new Paragraph({
            text: "คำถาม:",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
        }));

        data.questions.forEach((q, index) => {
            children.push(new Paragraph({
                text: `${index + 1}. ${q.q}`,
                spacing: { after: 100 }
            }));
            children.push(new Paragraph({
                text: "   ตอบ ___________________________________________________",
                spacing: { after: 300 }
            }));
        });

        const doc = new Document({
            styles: {
                default: {
                    document: {
                        run: {
                            font: "TH Sarabun PSK",
                            size: 32, // 16pt
                        },
                    },
                    heading1: {
                        run: {
                            font: "TH Sarabun PSK",
                            size: 40, // 20pt
                            bold: true,
                        },
                        paragraph: {
                            spacing: { after: 200 },
                        },
                    },
                    heading2: {
                        run: {
                            font: "TH Sarabun PSK",
                            size: 40, // 20pt
                            bold: true,
                        },
                        paragraph: {
                            spacing: { after: 200 },
                        },
                    }
                }
            },
            sections: [{
                properties: {},
                children: children
            }]
        });

        const buffer = await Packer.toBuffer(doc);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, buffer);
        
        return outputPath;
    }
}

module.exports = DOCXExporter;

const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

class PDFExporter {
    async export(data, outputPath) {
        await fsPromises.mkdir(path.dirname(outputPath), { recursive: true });
        
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const stream = fs.createWriteStream(outputPath);
                doc.pipe(stream);

                // Setup font for Thai
                const fontPath = path.join(__dirname, '../../../data/Sarabun-Regular.ttf');
                doc.font(fontPath);

                doc.fontSize(20).text(data.title, { align: 'center' });
                doc.moveDown(0.5);
                
                // Student info template
                doc.fontSize(16).text("ชื่อ-สกุล _____________________________________________ ชั้น ___________ เลขที่ _______", { align: 'center' });
                doc.moveDown(1.5);

                doc.fontSize(16).text(`คำชี้แจง: ${data.instructions}`);
                doc.moveDown();

                if (data.learningObjectives && data.learningObjectives.length > 0) {
                    doc.fontSize(16).text("จุดประสงค์การเรียนรู้:");
                    data.learningObjectives.forEach(obj => {
                        doc.text(`- ${obj}`);
                    });
                    doc.moveDown();
                }

                doc.fontSize(16).text("คำถาม:", { underline: true });
                doc.moveDown();

                doc.fontSize(16);
                data.questions.forEach((q, index) => {
                    doc.text(`${index + 1}. ${q.q}`);
                    doc.moveDown(0.5);
                    doc.text("   ตอบ ___________________________________________________");
                    doc.moveDown();
                });

                doc.end();

                stream.on('finish', () => resolve(outputPath));
                stream.on('error', reject);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = PDFExporter;

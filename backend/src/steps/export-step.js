const BaseStep = require('./base-step');
const path = require('path');
const TXTExporter = require('../services/export/txt-exporter');
const DOCXExporter = require('../services/export/docx-exporter');
const HTMLPDFExporter = require('../services/export/html-pdf-exporter');

class ExportStep extends BaseStep {
    async execute(context) {
        const formatStepId = this.params.formatStepId;
        const data = context.outputs[formatStepId];

        if (!data) {
            throw new Error(`ExportStep requires inputs from step ${formatStepId}`);
        }

        const format = this.params.format;
        const filename = `${context.workflowId}_${Date.now()}.${format}`;
        const outputPath = path.join(__dirname, '../../data', filename);

        console.log(`Exporting worksheet to ${format}...`);

        let exporter;
        switch (format) {
            case 'txt': exporter = new TXTExporter(); break;
            case 'docx': exporter = new DOCXExporter(); break;
            case 'pdf': exporter = new HTMLPDFExporter(); break;
            default: throw new Error(`Unsupported export format: ${format}`);
        }

        const savedPath = await exporter.export(data, outputPath);
        return {
            format,
            path: savedPath
        };
    }
}

module.exports = ExportStep;

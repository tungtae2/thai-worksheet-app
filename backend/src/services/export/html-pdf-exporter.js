const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const path = require('path');
const handlebars = require('handlebars');
const COLORING_ASSETS = require('../../templates/coloring_assets');

// Shuffle array helper
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

handlebars.registerHelper('addOne', function(value) {
    return value + 1;
});

handlebars.registerHelper('eq', function(arg1, arg2) {
    return (arg1 == arg2);
});

class HTMLPDFExporter {
    async export(data, outputPath) {
        console.log("Generating Canva-style PDF using Puppeteer...");
        
        // Pick 4 random decorations
        const shuffled = shuffle([...COLORING_ASSETS]);
        const selectedAssets = {
            dec1: shuffled[0],
            dec2: shuffled[1],
            dec3: shuffled[2],
            dec4: shuffled[3]
        };

        const templatePath = path.join(__dirname, '../../templates/worksheet.hbs');
        const templateHtml = await fs.readFile(templatePath, 'utf-8');
        
        const template = handlebars.compile(templateHtml);
        
        const html = template({
            ...data,
            assets: selectedAssets
        });

        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--single-process'
            ]
        });
        
        const page = await browser.newPage();
        
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        await browser.close();
        return outputPath;
    }
}

module.exports = HTMLPDFExporter;

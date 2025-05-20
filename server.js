const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');

const app = express();
const PORT = 5000;

app.use(cors());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Multer config
const upload = multer({ dest: uploadsDir });

// Set LibreOffice path (for Windows)
process.env.LIBREOFFICE_PATH = 'C:\\Program Files\\LibreOffice\\program';

// DOCX to PDF endpoint
app.post('/convert-to-pdf', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const inputPath = req.file.path;
    const outputPath = `${inputPath}.pdf`;

    try {
        const fileBuffer = fs.readFileSync(inputPath);
        libre.convert(fileBuffer, '.pdf', undefined, (err, done) => {
            if (err) {
                console.error('Conversion error:', err);
                return res.status(500).send('Conversion failed.');
            }

            fs.writeFileSync(outputPath, done);
            res.download(outputPath, 'converted.pdf', () => {
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        });
    } catch (error) {
        console.error('File processing error:', error);
        return res.status(500).send('Internal server error.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

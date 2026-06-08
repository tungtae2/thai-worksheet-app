require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./api/routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Serve generated files statically
app.use('/data', express.static(path.join(__dirname, '../data')));

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});

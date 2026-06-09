const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const policyRoutes = require('./routes/policies');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// Routes
app.use('/api/policies', policyRoutes);
app.use('/api/admin', require('./routes/admin')); // Admin Panel Routes
app.use('/api/claims', require('./routes/claims'));
app.use('/api/chat', require('./routes/chatbot'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/support', require('./routes/support'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/config', require('./routes/config'));

const path = require('path');

// Serve Uploaded Files Statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Files Statically (Needed for Visual Builder Iframe)
app.use(express.static(path.join(__dirname, '../')));

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running and healthy.' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

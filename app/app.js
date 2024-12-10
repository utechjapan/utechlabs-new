const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample Route
app.get('/', (req, res) => {
    res.send('Hello from the App Server!');
});

// API Route Example
app.get('/api/data', (req, res) => {
    res.json({ message: 'This is your app server data.' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`App server running on port ${PORT}`);
});

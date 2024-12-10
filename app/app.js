const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello from the App Server!');
});

app.listen(PORT, () => {
    console.log(`App server running on port ${PORT}`);
});

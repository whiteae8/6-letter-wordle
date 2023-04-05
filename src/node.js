const express = require('express');
const cors = require('cors');
const app = express();

// Use the cors middleware
app.use(cors());

// Route to your HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

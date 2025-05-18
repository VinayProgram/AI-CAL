const express = require('express');
const path = require('path');
console.log(path.join(__dirname, '../data/dataset/img'))
const app = express();

// Use path.join to correctly resolve the absolute path
app.use('/images', express.static(path.join(__dirname, '../data/dataset/img')));

app.listen(5000, () => console.log('Gracefully started'));

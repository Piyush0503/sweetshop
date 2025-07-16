const express = require('express');
const cors = require('cors');
const sweetRoutes = require('./routes/sweetRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/sweets', sweetRoutes);

module.exports = app;

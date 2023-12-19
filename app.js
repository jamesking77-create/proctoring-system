const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const colors = require('colors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/proctoring-system', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', (error) => console.log('MongoDB Connection error:'.red.underline, error));

app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Internal server error'});
});

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgYellow);
});
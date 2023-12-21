const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authControllers = require('./controllers/authControllers');

const colors = require('colors');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/proctoring-system',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB'.green.underline)
});

// router.post('/auth/register', authControllers.registerUser);
// router.post('/auth/login', authControllers.login);

app.use('/api/users', router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Internal server error'});
});

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.yellow);
});


// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
//
// const colors = require('colors');
//
// const app = express();
//
// app.use(bodyParser.json());
// app.use(cors());
//
// mongoose.connect('mongodb://127.0.0.1:27017/proctoring-system', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connection.on('error', (error) => console.log('MongoDB Connection error:'.red.underline, error));
//
// app.use('/auth', authRoutes);
//
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({message: 'Internal server error'});
// });
//
// const PORT = process.env.port || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`.bgYellow);
// });
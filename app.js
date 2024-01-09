const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authControllers = require('./controllers/authControllers');
const testControllers  = require('./controllers/testControllers')
const config = require('./config/config');
const router = express.Router();
const authenticateToken = require('../proctoringsystem/middleware/authentication')
const encryptedQuestions = require('../proctoringsystem/utils/encryption')
const crypto = require("crypto");
const  question  = require('../proctoringsystem/questionBank/questionBank');

mongoose.connect(config.mongodb.url);

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`.rainbow);
});

app.use(express.json());
app.use(cors());
app.use("/api", router);

router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.login);
router.get("/getRegistrationKey", authControllers.getRegistrationKey);
router.get("/getLoginKey", authControllers.getLoginKey);
router.get("/getQuestionKey", testControllers.getQuestionsKey)
router.get("/protected-resource", authenticateToken.authenticateToken, (req,res) => {
    res.json({message: "Access granted to protected resource"});
});
router.get('/questions', testControllers.encryptedQuestion);



app.get("/", (req, res) => {
    res.send("server is working");
});

// app.use(bodyParser.json());

const db = mongoose.connection;




db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB'.green)
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Internal server this error'});
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
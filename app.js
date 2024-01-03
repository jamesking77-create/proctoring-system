const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const authControllers = require('./controllers/authControllers');
const config = require('./config/config');
const colors = require('colors')
const {authenticateToken, protect} = require("./middleware/authentication");
const router = express.Router();
const authenticateToken = require('../proctoring-system/middleware/authentication')

mongoose.connect(config.mongodb.url);

const PORT = process.env.port || 3000;

app.use(express.json());
app.use(cors());

router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.login);
router.get("/protected-resource", protect, (req, res) => {
    res.json({message: "Access granted to protected resource"});
});

router.get("/protected-resource", authenticateToken.authenticateToken, (req,res) => {
    res.json({message: "Access granted to protected resource"});
});

app.use("/api", router);

app.get("/", (req, res) => {
    res.send("server is working");
});

// app.use(bodyParser.json());

const db = mongoose.connection;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`.rainbow);
});


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB'.green)
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Internal server error'});
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
// const express = require('express');
// const authControllers = require('../controllers/authControllers');


// const router = express.Router();
// router.post('/register', authControllers.registerUser);
// router.post('/login',authControllers.login )

// module.exports = router;

const express = require("express");
const authControllers = require("../controllers/authControllers");
const app = express();
const router = express.Router();

const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(config.mongodb.url);


const PORT = 3000;

app.use(express.json());
app.use("/api", router);

router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.login);


app.get("/", (req, res) => {
  res.send("server is working");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 

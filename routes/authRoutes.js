const express = require('express');
const authControllers = require('../controllers/authControllers');

const router = express.Router();
router.post('/register', authControllers.registerUser);

module.exports = router;
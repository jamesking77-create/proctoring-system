const express = require('express');
const authControllers = require('../controllers/authControllers');
const app = express();
const router = express.Router();

const PORT = 3000;

// Use middleware to parse JSON requests
app.use(express.json());
app.use('/api', router);
// Define your routes on the router object
 router.post('/register', authControllers.registerUser);
 router.post('/login', authControllers.login);

// Mount the router for the '/api' path


// Default route
app.get('/', (req, res) => {
  res.send('server is working');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

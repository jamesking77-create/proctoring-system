const express = require("express");
const authControllers = require("../controllers/authControllers");
const app = express();
const router = express.Router();

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

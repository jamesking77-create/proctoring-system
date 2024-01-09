const encryption = require("../utils/encryption");

const questionList = [
  {
    question: "What is the purpose of a variable in programming?",
    options: [
      { text: "To store and manipulate data", isCorrect: true },
      { text: "To create loops", isCorrect: false },
      { text: "To define functions", isCorrect: false },
      { text: "To display output", isCorrect: false },
    ],
  },
  {
    question: "Which programming language is used to build websites?",
    options: [
      { text: "Java", isCorrect: false },
      { text: "Python", isCorrect: false },
      { text: "JavaScript", isCorrect: true },
      { text: "C++", isCorrect: false },
    ],
  },
  {
    question:
      "What is the process of finding and fixing errors in a program called?",
    options: [
      { text: "Debugging", isCorrect: true },
      { text: "Compiling", isCorrect: false },
      { text: "Interpreting", isCorrect: false },
      { text: "Executing", isCorrect: false },
    ],
  },
  {
    question: "What is an algorithm?",
    options: [
      {
        text: "A step-by-step procedure for solving a problem",
        isCorrect: true,
      },
      { text: "A programming language", isCorrect: false },
      { text: "A database management system", isCorrect: false },
      { text: "A hardware component", isCorrect: false },
    ],
  },
  {
    question: "What is a loop in programming?",
    options: [
      { text: "A condition that ends a program", isCorrect: false },
      { text: "A type of variable", isCorrect: false },
      { text: "A way to repeat a block of code", isCorrect: true },
      { text: "A debugging technique", isCorrect: false },
    ],
  },
  {
    question: "What is the syntax for a 'for' loop in JavaScript?",
    options: [
      { text: "for (var i = 0; i < 5; i++)", isCorrect: true },
      { text: "for (i = 0; i < 5; i++)", isCorrect: false },
      { text: "for (i = 0; i < 5)", isCorrect: false },
      { text: "for (var i = 0; i++)", isCorrect: false },
    ],
  },
  {
    question: "What does HTML stand for?",
    options: [
      { text: "Hyper Text Markup Language", isCorrect: true },
      { text: "High-Level Machine Language", isCorrect: false },
      { text: "Home Tool Markup Language", isCorrect: false },
      { text: "Human Terminal Markup Language", isCorrect: false },
    ],
  },
  {
    question: "What is the purpose of CSS in web development?",
    options: [
      { text: "To define the structure of a webpage", isCorrect: false },
      { text: "To add interactivity to a webpage", isCorrect: false },
      { text: "To style the appearance of a webpage", isCorrect: true },
      { text: "To perform server-side operations", isCorrect: false },
    ],
  },
  {
    question: "What is a function in programming?",
    options: [
      { text: "A type of variable", isCorrect: false },
      { text: "A loop construct", isCorrect: false },
      { text: "A reusable block of code", isCorrect: true },
      { text: "A way to declare constants", isCorrect: false },
    ],
  },
  {
    question:
      "What is the symbol for assignment operator in many programming languages?",
    options: [
      { text: "=", isCorrect: true },
      { text: "==", isCorrect: false },
      { text: "=>", isCorrect: false },
      { text: "<=", isCorrect: false },
    ],
  },
  {
    question: "What is the result of 5 + '5' in JavaScript?",
    options: [
      { text: "55", isCorrect: true },
      { text: "10", isCorrect: false },
      { text: "TypeError", isCorrect: false },
      { text: "NaN", isCorrect: false },
    ],
  },
  {
    question: "What is the file extension for a Python source code file?",
    options: [
      { text: ".py", isCorrect: true },
      { text: ".exe", isCorrect: false },
      { text: ".txt", isCorrect: false },
      { text: ".html", isCorrect: false },
    ],
  },
  {
    question:
      "Which data structure operates on a 'first-in, first-out' principle?",
    options: [
      { text: "Stack", isCorrect: false },
      { text: "Queue", isCorrect: true },
      { text: "Array", isCorrect: false },
      { text: "Linked list", isCorrect: false },
    ],
  },
  {
    question: "What is the purpose of the 'if' statement in programming?",
    options: [
      { text: "To create a loop", isCorrect: false },
      { text: "To define a function", isCorrect: false },
      { text: "To make decisions based on conditions", isCorrect: true },
      { text: "To perform mathematical operations", isCorrect: false },
    ],
  },
  {
    question: "What does the acronym 'SQL' stand for?",
    options: [
      { text: "Structured Query Language", isCorrect: true },
      { text: "Sequential Query Language", isCorrect: false },
      { text: "Standard Query Language", isCorrect: false },
      { text: "System Query Language", isCorrect: false },
    ],
  },
  {
    question:
      "Which operator is used to concatenate strings in many programming languages?",
    options: [
      { text: "+", isCorrect: true },
      { text: "*", isCorrect: false },
      { text: "/", isCorrect: false },
      { text: "-", isCorrect: false },
    ],
  },
  {
    question: "What is the result of true && false in boolean logic?",
    options: [
      { text: "true", isCorrect: false },
      { text: "typeError", isCorrect: false },
      { text: "SyntaxError", isCorrect: false },
      { text: "false", isCorrect: true },
    ],
  },
  {
    question: "What is the purpose of comments in programming?",
    options: [
      { text: "To include external libraries", isCorrect: false },
      { text: "To highlight syntax errors", isCorrect: false },
      { text: "To provide explanations and documentation", isCorrect: true },
      { text: "To create loops", isCorrect: false },
    ],
  },
  {
    question:
      "Which programming language is known for its use in machine learning and data analysis?",
    options: [
      { text: "Java", isCorrect: false },
      { text: "Python", isCorrect: true },
      { text: "JavaScript", isCorrect: false },
      { text: "C#", isCorrect: false },
    ],
  },
  {
    question: "What is the result of 10 % 3 in many programming languages?",
    options: [
      { text: "1", isCorrect: true },
      { text: "3", isCorrect: false },
      { text: "0", isCorrect: false },
      { text: "10", isCorrect: false },
    ],
  },
];
let encryptQuestionKey = encryption.generateQuestionsRadomKey(32);
let decryptQuestionResponseKey = encryption.generateQuestionsRadomKey(32);

const getQuestionsKey = async (req, res) => {
  try {
    let mainKey = encryption.generateQuestionsRadomKey(32);
    return res.status(201).json(mainKey);
  } catch (err) {
    return err;
  }
};


function encryptedQuestion(req, res) {
  try {
    const encryptQuestions = encryption.encryptQuestions(questionList, encryptQuestionKey);
    return res.json({ encryptQuestions });
  } catch (error) {
    console.error('Error encrypting questions:', error);

    if (error instanceof EncryptionError) {
      return res.status(500).json({ error: 'Encryption failed', details: error.message });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

async function handlesubmit(req, res) {
  const userResponses = req.body;
  const decryptedResponses =encryption.decryptQuestionResponse(userResponses,decryptQuestionResponseKey);
  
}

module.exports = {
  getQuestionsKey,
  encryptedQuestion,
};

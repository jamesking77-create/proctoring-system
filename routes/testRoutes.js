const CryptoJS = require("crypto-js");

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
];
// Function to generate a random key
function generateRandomKey() {
  const randomKey = CryptoJS.lib.WordArray.random(16); // 16 bytes for a 128-bit key
  return randomKey.toString();
}

// Function to encrypt data
function encryptQuestions(data, key) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  return encryptedData;
}

  
// Function to decrypt data
function decryptQuestions(encryptedData, key) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

// Generate a random key
const encryptionKey = generateRandomKey();

// Encrypt the questionList
const encryptedQuestionList = encryptQuestions(questionList, encryptionKey);

// Log the generated key
console.log("Generated Encryption Key:", encryptionKey);

// Log the encrypted questionList
console.log("Encrypted Question List:", encryptedQuestionList);

// Decrypt the questionList
const decryptedQuestionList = decryptQuestions(
  encryptedQuestionList,
  encryptionKey
);

// Log the decrypted questionList
console.log("Decrypted Question List:", decryptedQuestionList);

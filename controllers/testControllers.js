const encryption = require("../utils/encryption");
const questionList = require("../questionBank/questionBank");

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
    const encryptQuestions = encryption.encryptQuestions(
      questionList,
      encryptQuestionKey
    );
    return res.json({ encryptQuestions });
  } catch (error) {
    console.error("Error encrypting questions:", error);

    if (error instanceof EncryptionError) {
      return res
        .status(500)
        .json({ error: "Encryption failed", details: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function handlesubmit(req, res) {
//   const userResponses = req.body.response;
//   const decryptedResponses = encryption.decryptQuestionResponse(
//     userResponses,
//     decryptQuestionResponseKey
//   );  
  const userPassFailStatus = calculatePassFailStatus(req.body.responses);
  res.json({ success: true, passFailStatus: userPassFailStatus });
}

function calculatePassFailStatus(responses) {
  const passingThreshold = 0.7; 
  const correctCount = responses.filter(
    (response) => response.isCorrect
  ).length;
  const correctnessPercentage = correctCount / responses.length;
  return correctnessPercentage >= passingThreshold ? "Pass" : "Fail";
}

module.exports = {
  getQuestionsKey,
  encryptedQuestion,
  handlesubmit,
};

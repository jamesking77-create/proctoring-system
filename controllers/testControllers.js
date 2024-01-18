const encryption = require("../utils/encryption");
const questionList = require("../questionBank/questionBank");

let encryptQuestionKey = null;


function getGenKey(req, res) {
  try {
    encryptQuestionKey = encryption.generateQuestionsRadomKey(32);
    console.log("this is the mainKey-->", encryptQuestionKey);

    return encryptQuestionKey;
  } catch (err) {
    return err;
  }
}

async function encryptedQuestion(req, res) {
  try {
    const key = await getGenKey();

    const encryptQuestions = encryption.encryptQuestions(questionList, key);
    console.log("this is key to encrypt-->", key);
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

function getQuestionsKey(req, res) {
  try {
      console.log("this is key sent to frontend -->", encryptQuestionKey);
    return res.status(201).json(encryptQuestionKey);
  } catch (err) {
    return err;
  }
}

async function handlesubmit(req, res) {
  const userResponses = req.body.responses;
  //   const decryptedResponses = encryption.decryptQuestionResponse(
  //     userResponses,
  //     decryptQuestionResponseKey
  //   );
  const userPassFailStatus = calculatePassFailStatus(userResponses);
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

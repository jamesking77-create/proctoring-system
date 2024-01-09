const encryption = require("../utils/encryption");
const questionList = require('../questionBank/questionBank')

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
  const userResponses = req.body.response;
  const decryptedResponses =encryption.decryptQuestionResponse(userResponses,decryptQuestionResponseKey);
  const userId = req.body.userId; // Adjust this based on your actual request structure
 


  // Process and store user responses in the database
  const userPassFailStatus = calculatePassFailStatus(decryptedResponses);

  // Save user responses and pass/fail status to the database
  for (const response of decryptedResponses) {
    const { questionId, isCorrect } = response;

    const userResponse = new UserResponse({
      user: userId,
      questionId: questionId,
      isCorrect: isCorrect,
      // Add other relevant fields as needed
    });

    await userResponse.save();
  }

  // Update the user's pass/fail status in the User model
  await User.findByIdAndUpdate(userId, { passFailStatus: userPassFailStatus });

  // Respond with success and the pass/fail status
  res.json({ success: true, passFailStatus: userPassFailStatus });
}


function calculatePassFailStatus(responses) {
  // Define your passing threshold (e.g., the user needs to answer at least 70% of the questions correctly)
  const passingThreshold = 0.7; // 70%

  // Count the number of correct responses
  const correctCount = responses.filter((response) => response.isCorrect).length;

  // Calculate the percentage of correct responses
  const correctnessPercentage = correctCount / responses.length;

  // Determine pass or fail based on the calculated percentage
  return correctnessPercentage >= passingThreshold ? 'Pass' : 'Fail';
}
module.exports = {
    getQuestionsKey,
    encryptedQuestion,
  };
  
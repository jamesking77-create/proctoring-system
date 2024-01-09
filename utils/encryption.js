const crypto = require("crypto");
const CryptoJS = require("crypto-js");

function generateRegRandomKey(length) {
  const randomKey = crypto.randomBytes(length).toString("hex");
  return randomKey;
}

function generateLogRandomKey(length) {
  const randomKey = crypto.randomBytes(length).toString("hex");
  return randomKey;
}

function generateQuestionsRadomKey(length){
    const randomKey = crypto.randomBytes(length).toString("hex")
    return randomKey
}

function decryptData(encryptedData, secretKey) {
  try {
    const key = CryptoJS.enc.Hex.parse(secretKey);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

function encryptQuestions(data, key) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  return encryptedData;
}

  
  
  const decryptQuestionResponse = (encryptedData,decryptQuestionResponseKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, decryptQuestionResponseKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

module.exports = {
  generateRegRandomKey,
  generateLogRandomKey,
  generateQuestionsRadomKey,
  decryptData,
  encryptQuestions,
  decryptQuestionResponse,
};

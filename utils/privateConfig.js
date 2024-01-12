const encryptionUtils = require("./encryption");
const secretKey = encryptionUtils.generateRandomKey(32);
process.env.SECRET_KEY = secretKey;


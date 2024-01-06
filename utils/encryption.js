const crypto = require('crypto');



function generateRegRandomKey(length) {
    const randomKey = crypto.randomBytes(length).toString('hex');
    return randomKey

}

function generateLogRandomKey(length) {
    const randomKey = crypto.randomBytes(length).toString('hex');
    return randomKey

}



module.exports = {
    generateRegRandomKey,
    generateLogRandomKey,
};

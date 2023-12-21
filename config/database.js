// module.exports = {
//     url: 'mongodb://127.0.0.1:27017/proctoring-system'
// }
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);

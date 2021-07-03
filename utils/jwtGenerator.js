const jwt = require('jsonwebtoken');
require('dotenv').config();

function tokenGenerator(userId){
    const payload = {
        user_id : userId
    }
    return jwt.sign(payload , process.env.secretKey , {expiresIn: '1hr'});
}

module.exports = tokenGenerator;
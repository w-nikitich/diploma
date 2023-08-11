const Users = require('../models/Users');

async function checkUser(chat_id) {
    if (await Users.findOne({where: {chat_id: chat_id}}) !== null) {
        return true;
    }

    return false;
}

module.exports = checkUser;
const { Telegraf, Scenes, session } = require('telegraf');
const sequelize = require('../db/db');
const Users = require('../models/Users');
const checkUser = require('../additional/checkUser');
const { registration } = require('../scenes/Registration');
const {feedback} = require('../scenes/Feedback');
const {userInfo, checkUserdata} = require('../scenes/Userdata');
const {mainMenu} = require('../scenes/MainMenu');
const {category, menu} = require('../scenes/Menu');
const {basket, changeAmount, deleteOrderElem} = require('../scenes/Basket');
const {addProducts} = require('../migrations/addProducts');
require('dotenv').config();

const bot = require('./bot');

bot.use(session());

const stage = new Scenes.Stage([registration, checkUserdata(), userInfo(), mainMenu(), category(), menu(), basket(), feedback, changeAmount(), deleteOrderElem()]);
bot.use(stage.middleware());

bot.start(async(ctx) => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        // await addProducts();

        const chat_id = ctx.chat.id;

        if (await checkUser(chat_id) === true) {
            ctx.scene.enter('check_userdata');
            // ctx.scene.enter('check_user_data');
        }
        else {
            await Users.create({chat_id: chat_id});
            ctx.scene.enter('reg');
        }
    }
    catch(e) {
        console.error(e);
    } 
})

bot.launch();

module.exports = bot;
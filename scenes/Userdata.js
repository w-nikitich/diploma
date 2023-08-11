const { Scenes } = require('telegraf');
const Users = require('../models/Users');
const {addUserdataBtns} = require('../keyboards/Navigation');
const sceneNames = require('../additional/listOfScenes');

class Userdata {
    userInfo() {
        const userInfo = new Scenes.BaseScene('userInfo');

        userInfo.enter(async (ctx) => {
            let thisUser = await Users.findOne({where: {chat_id: ctx.chat.id}});
            ctx.replyWithMarkdownV2(`*Ваші дані*:\n\n*Ім'я*: ${thisUser.name}\n*Фамілія*: ${thisUser.surname}`, await addUserdataBtns());
        });

        userInfo.action('changeUserdata', async (ctx) => {
            await ctx.answerCbQuery();
            ctx.scene.enter('reg');
        });

        userInfo.action('mainMenu', async (ctx) => {
            await ctx.answerCbQuery();
            ctx.scene.enter('main_menu');
        });

        userInfo.on('callback_query', async (ctx) => {
            const clickedSceneData = ctx.callbackQuery.data;
            const clickedSceneName = sceneNames[clickedSceneData];
            await ctx.answerCbQuery();
            await ctx.scene.enter(clickedSceneName);
        })

        return userInfo;
    }

    checkUserdata() {
        const checkUserdata = new Scenes.WizardScene('check_userdata',
        async(ctx) => {
            await ctx.reply('Ви вже є в нашій базі. Будь ласка, перевірте свої дані.');
            ctx.scene.enter('userInfo');
        });

        return checkUserdata;
    }
}

module.exports = new Userdata();

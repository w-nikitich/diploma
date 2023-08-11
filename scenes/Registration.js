const { Scenes, Markup, WizardScene } = require('telegraf');
const Users = require('../models/Users');
const sceneNames = require('../additional/listOfScenes');

const registration = new Scenes.WizardScene('reg',
    async(ctx) => {
        await ctx.reply('Уведіть своє імя:');
        ctx.wizard.next();
    },
    async(ctx) => {
        const name = ctx.message.text;
        const thisUser = await Users.findOne({where: {chat_id: ctx.chat.id}});
        thisUser.name = name;
        await thisUser.save();
        await ctx.reply('Уведіть свою фамілію:');
        ctx.wizard.next();
    },
    async(ctx) => {
        const surname = ctx.message.text;
        const thisUser = await Users.findOne({where: {chat_id: ctx.chat.id}});
        thisUser.surname = surname;
        await thisUser.save();
        await ctx.reply('Дякуємо! Ви успішно пройшли реєстрацію!');
        ctx.scene.enter('userInfo');
    }
);

// registration.on('callback_query', async (ctx) => {
//     const clickedSceneData = ctx.callbackQuery.data;
//     const clickedSceneName = sceneNames[clickedSceneData];
//     await ctx.answerCbQuery();
//     await ctx.scene.enter(clickedSceneName);
// });

module.exports = {registration};
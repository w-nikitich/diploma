const { Scenes, Markup } = require('telegraf');
const {addMainMenuBtns, addMenuCategoryBtns, addHistoryDateBtns} = require('../keyboards/Navigation');
const sceneNames = require('../additional/listOfScenes');
const Histories = require('../models/Histories');

class MainMenu {

    mainMenu() {
        const mainMenu = new Scenes.BaseScene('main_menu');

        mainMenu.enter(async (ctx) => {
            await ctx.reply('Ви в головному меню', await addMainMenuBtns()); 
        });

        mainMenu.action('user_data', async (ctx) => {
            await ctx.answerCbQuery();
            ctx.scene.enter('userInfo');
        });

        mainMenu.action('menu', async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.scene.enter('category');
        });

        mainMenu.action('basket', async (ctx) => {
            await ctx.answerCbQuery();
            // const clickedSceneData = ctx.callbackQuery.data;
            // const clickedSceneName = sceneNames[clickedSceneData];
            ctx.session.prevScene = 'main_menu';
            await ctx.scene.enter('basket');
        });

        mainMenu.action('history', async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.reply('Ось дати ваших замовлень. Оберіть для детальнішої інформації.', Markup.inlineKeyboard(await addHistoryDateBtns()));
        });

        mainMenu.action('feedback', async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.scene.enter('feedback');
        });

        mainMenu.on('callback_query', async (ctx) => {
            await ctx.answerCbQuery();
            const clickedSceneData = ctx.callbackQuery.data;
            const clickedSceneName = sceneNames[clickedSceneData];
            ctx.session.prevScene = clickedSceneName;
            await ctx.scene.enter(clickedSceneName);
        });

        return mainMenu;
    }
}

module.exports = new MainMenu();
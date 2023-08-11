const { Scenes, Markup } = require('telegraf');
const {addMenuCategoryBtns, addMenuDishBtns, addDishDataBtns,addDishNavBtns} = require('../keyboards/Navigation');
const {dishConvertation} = require('../additional/dataConvert');
const Menus = require('../models/Menus');
const Orders = require('../models/Orders');
const numberGenerate = require('../additional/numberGenerate');
const checkOrderNumber = require('../additional/checkOrderNumber');
const isEqualOrder = require('../additional/isEqualOrder');
const sceneNames = require('../additional/listOfScenes');

class Menu {
    category() {
        const category = new Scenes.BaseScene('category');

        category.enter(async (ctx) => {
            const keyboard = await addMenuCategoryBtns();
            await ctx.reply('Оберіть категорію', Markup.inlineKeyboard(keyboard[0]));
            await ctx.scene.enter('menu');
        });

        category.on('callback_query', async (ctx) => {
            const clickedSceneData = ctx.callbackQuery.data;
            const clickedSceneName = sceneNames[clickedSceneData];
            await ctx.answerCbQuery();
            await ctx.scene.enter(clickedSceneName);
        });

        return category;
    }

    menu() {
        const menu = new Scenes.BaseScene('menu');

        menu.enter(async (ctx) => {
            const keyboardCategory = await addMenuCategoryBtns();
            const callbacksDishes = await dishConvertation();

            keyboardCategory[1].forEach((el, index) => {
                menu.action(el, async(ctx) => {
                    await ctx.answerCbQuery();
                    ctx.session.categ = keyboardCategory[2][index];
                    const keyboardDish = await addMenuDishBtns(ctx.session.categ);
                    await ctx.reply('Оберіть страву для детальнішої інформації', Markup.inlineKeyboard(keyboardDish[0]));
                });
            });

            callbacksDishes[0].forEach((el, index) => {
                menu.action(el, async (ctx) => {
                    await ctx.answerCbQuery();
                    const dishData = await Menus.findAll({where: {name: callbacksDishes[1][index].name}});
                    ctx.session.obj = dishData[0].dataValues;
                    await ctx.sendPhoto({ source: `./images/${ctx.session.obj.photo}`},{caption:`*Назва*: ${ctx.session.obj.name}\n*Ціна*: ${ctx.session.obj.price} грн`, parse_mode: 'MarkdownV2', reply_markup: {inline_keyboard: await addDishDataBtns()}})
                                .then((sentMessage) => {
                                    ctx.session.messageId = sentMessage.message_id;
                                }); 
                });
            });

            menu.action('basket', async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.scene.enter('basket');
            })

            menu.action('backToMainMenu', async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.scene.enter('main_menu');
            });

            menu.action('backToCategory', async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.scene.enter('category');
            });

            // ??? To do (check if exists)
            menu.action('backToMenu', async (ctx) => {
                await ctx.answerCbQuery();
            });

            menu.action('backToMenuDish', async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.deleteMessage(ctx.session.messageId);
            });

            menu.action('backToDishData', async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.editMessageCaption(`*Назва*: ${ctx.session.obj.name}\n*Ціна*: ${ctx.session.obj.price} грн`, {parse_mode: 'MarkdownV2', reply_markup: {inline_keyboard: await addDishDataBtns()}, message_id: ctx.session.messageId});
            });

            //if can remove [0-9]
            // 
            menu.action('add', async (ctx) => {
                await ctx.answerCbQuery();
                ctx.session.amount = 0;
                await ctx.editMessageCaption(`Ви хочете замовити *${ctx.session.obj.name}*\n*Оберіть кількість*`, {parse_mode: 'MarkdownV2', reply_markup: {inline_keyboard: await addDishNavBtns(ctx.session.amount)}})
                            .then((sentMessage) => {
                                ctx.session.messageId = sentMessage.message_id;
                            });
            });

            // check how works with values (add to db) and if can remove [0-9]
            menu.action('ingr', async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.reply(`*До складу входять:*\n${ctx.session.obj.ingredients}`, {parse_mode: 'MarkdownV2'});
            });

            menu.action('minus', async (ctx) => {
                await ctx.answerCbQuery();
                ctx.session.amount--;
                
                if (ctx.session.amount < 0) {
                    ctx.session.amount = 0;
                }
                else {
                    await ctx.editMessageReplyMarkup({inline_keyboard: await addDishNavBtns(ctx.session.amount), message_id: ctx.session.messageId});
                }
            });

            menu.action('plus', async (ctx) => {
                await ctx.answerCbQuery();
                ctx.session.amount++;
                await ctx.editMessageReplyMarkup({inline_keyboard: await addDishNavBtns(ctx.session.amount), message_id: ctx.session.messageId});
            });

            menu.action('amount', async (ctx) => {
                await ctx.answerCbQuery();
            });

            menu.action('addToBasket', async (ctx) => {
                await ctx.answerCbQuery();
                const time = new Date();
                const number = numberGenerate();
                const isOrder = await isEqualOrder(ctx.session.obj.id);

                if (ctx.session.amount == 0) {
                    ctx.reply('Вибачте, Ви не можете додати в кошик 0 елементів');
                    return;
                }

                if (isOrder == null) {
                    await Orders.create({
                        user_id: ctx.callbackQuery.from.id,
                        product_id: ctx.session.obj.id,
                        product_price: ctx.session.obj.price,
                        amount: ctx.session.amount,
                        order_number: number,
                        time: time
                    });
                }
                else {
                    isOrder.amount += ctx.session.amount;
                    await isOrder.save();
                }
    
                checkOrderNumber(ctx.from.id, number);
                await ctx.reply(`До Вашого кошику додано ${ctx.session.obj.name} в кількості ${ctx.session.amount}.`);
                // add keyboad: мій кошик, продовжити замовляти

                // console.log(await Orders.findAll())
            });

            // menu.on('callback_query', async (ctx) => {
            //     const clickedSceneData = ctx.callbackQuery.data;
            //     const clickedSceneName = sceneNames[clickedSceneData];
            //     await ctx.answerCbQuery();
            //     await ctx.scene.enter(clickedSceneName);
            // });
        });

        return menu;
    }
}

module.exports = new Menu();
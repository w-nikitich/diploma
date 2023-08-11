const { Scenes, Markup, WizardScene } = require('telegraf');
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const Orders = require('../models/Orders');
const Menus = require('../models/Menus');
const Histories = require('../models/Histories');
const {basketDataConvertation} = require('../additional/dataConvert');
const sceneNames = require('../additional/listOfScenes');
const addBasketNavBtns = require('../keyboards/Navigation').addBasketNavBtns;
const addBasketDishesBtns = require('../keyboards/Navigation').addBasketDishesBtns;
const addDishNavBtns = require('../keyboards/Navigation').addDishNavBtns;
const addDishDataBtns = require('../keyboards/Navigation').addDishDataBtns;
const {getOrderElement} = require('../additional/getOrderElement');
const bot = require('../src/bot');

class Basket {

    basket() {
        const basket = new Scenes.BaseScene('basket');

        basket.enter(async (ctx) => {
            const orderElements = await Orders.findAll({where: {user_id: ctx.from.id}});

            const string = await basketDataConvertation(orderElements);
            ctx.reply(`*Ви хочете замовити:*${string}`, {parse_mode: 'MarkdownV2', reply_markup: {inline_keyboard: await addBasketNavBtns()}});

            basket.action('changeAmount', async (ctx) => {
                // change buttons on dish names -> ctx.enter to add function in menu scene -> if name === name update row
                await ctx.answerCbQuery();
                await ctx.scene.enter('change_amount');
    
                // console.log(ctx.session.button.callback_data)
                // bot.telegram.triggerCallbackQuery(ctx.callbackQuery.id, ctx.session.button.callback)
                // await ctx.enter();
            });

            basket.action('deleteOrderElem', async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.scene.enter('delete_order');
            });

            basket.action('toOrder', async (ctx) => {
                await ctx.answerCbQuery();
                ctx.reply('Ваше замовлення прийнято! З Вами зв\'яжеться кур\'єр.');

                //add to histories
                for (const elements of orderElements) {
                    const orderMenuData = await Menus.findOne({where: {id: elements.dataValues.product_id}});
                    const time = new Date();

                    await Histories.create({
                        user_id: ctx.chat.id,
                        product_id: elements.dataValues.product_id,
                        price:  orderMenuData.dataValues.price,
                        amount: elements.dataValues.amount, 
                        order_number: elements.dataValues.order_number
                    });
                }

            });
        });

        basket.action('backToPrev', async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.scene.enter('main_menu');
        });

        basket.action('backToBasket', async(ctx) => {
            await ctx.deleteMessage(ctx.session.messageId);
        });

        // basket.on('callback_query', async (ctx) => {
        //     const clickedSceneData = ctx.callbackQuery.data;
        //     const clickedSceneName = sceneNames[clickedSceneData];
        //     await ctx.answerCbQuery();
        //     await ctx.scene.enter(clickedSceneName);
        // });
        // pay , change amount, delete, back

        return basket;
    }

    changeAmount() {
        const changeAmount = new Scenes.WizardScene('change_amount', 
                async (ctx) => {
                    await ctx.reply('Оберіть страву, кількість котрої хочете змінити.', Markup.inlineKeyboard(await addBasketDishesBtns(ctx.from.id)))
                    ctx.wizard.next();
                },
                async (ctx) => {
                    await ctx.answerCbQuery();
                    
                    const orderCallback = ctx.callbackQuery.data;
                    const inlineKeyboard = ctx.callbackQuery.message.reply_markup.inline_keyboard;
                    const clickedButton = inlineKeyboard.flat(Infinity).find((button) => button.callback_data === orderCallback);
                    ctx.session.orderButtonText = clickedButton.text;

                    if (ctx.session.orderButtonText == 'Назад') {
                        ctx.wizard.next();
                        return ctx.wizard.steps[ctx.wizard.cursor](ctx);    
                    }
                    else {
                        const orderElement = await getOrderElement(ctx, ctx.session.orderButtonText);

                        ctx.session.amount = orderElement.dataValues.amount;
    
                        ctx.reply('Оберіть кількість замовлення', Markup.inlineKeyboard(await addDishNavBtns(ctx.session.amount)))
                            .then((sentMessage) => {
                                ctx.session.messageId = sentMessage.message_id;
                            });
                    }
                    
                    changeAmount.action('minus', async (ctx) => {
                        await ctx.answerCbQuery();
                        ctx.session.amount--;
                        
                        if (ctx.session.amount < 0) {
                            ctx.session.amount = 0;
                        }
                        else {
                            await ctx.editMessageReplyMarkup({inline_keyboard: await addDishNavBtns(ctx.session.amount), message_id: ctx.session.messageId});
                        }
                    });

                    changeAmount.action('plus', async (ctx) => {
                        await ctx.answerCbQuery();
                        ctx.session.amount++;
                        await ctx.editMessageReplyMarkup({inline_keyboard: await addDishNavBtns(ctx.session.amount), message_id: ctx.session.messageId});
                    });

                    changeAmount.action('amount', async (ctx) => {
                        await ctx.answerCbQuery();
                    });

                    changeAmount.action('addToBasket', async (ctx) => {
                        await ctx.answerCbQuery();
                        const orderElement = await getOrderElement(ctx, ctx.session.orderButtonText);

                        orderElement.amount = ctx.session.amount;
                        await orderElement.save();
                        ctx.scene.enter('basket');
                    });
                },
                async (ctx) => {
                    await ctx.answerCbQuery();
                    await ctx.scene.enter('basket');
                }
        );
        return changeAmount;
                
    }

    deleteOrderElem() {
        const deleteOrderElem = new Scenes.WizardScene('delete_order',
            async (ctx) => {
                await ctx.reply('Оберіть страву, котру хочете видалити з кошика.', Markup.inlineKeyboard(await addBasketDishesBtns(ctx.from.id)))
                ctx.wizard.next();
            },
            async (ctx) => {
                await ctx.answerCbQuery();
                const orderCallback = ctx.callbackQuery.data;
                const inlineKeyboard = ctx.callbackQuery.message.reply_markup.inline_keyboard;
                const clickedButton = inlineKeyboard.flat(Infinity).find((button) => button.callback_data === orderCallback);
                ctx.session.orderButtonText = clickedButton.text;

                if (ctx.session.orderButtonText == 'Назад') {
                    ctx.wizard.next();
                    return ctx.wizard.steps[ctx.wizard.cursor](ctx);    
                }
                else {
                    console.log(ctx.session.orderButtonText)
                    const orderElement = await getOrderElement(ctx, ctx.session.orderButtonText);
                    await Orders.destroy({where: {product_id: orderElement.dataValues.product_id}});
                }

                ctx.wizard.next();
                return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            },
            async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.scene.enter('basket');
            }
        );

        return deleteOrderElem;
    }
}

module.exports = new Basket();
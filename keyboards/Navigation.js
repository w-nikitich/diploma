const { Markup } = require('telegraf');
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const Menus = require('../models/Menus');
const Orders = require('../models/Orders');
const Histories = require('../models/Histories');
const sequelize = require('../db/db');
const Sequelize = require('sequelize');
// const { where } = require('sequelize');

class Navigation {
    async addUserdataBtns() {
        return Markup.inlineKeyboard([
            [Markup.button.callback('Змінити', 'changeUserdata'), Markup.button.callback('Головне меню', 'mainMenu')]
        ])
    }

    async addMainMenuBtns() {
        return Markup.inlineKeyboard([
            [Markup.button.callback('Меню', 'menu'), Markup.button.callback('Кошик', 'basket')],
            [Markup.button.callback('Історія замовлень', 'history'), Markup.button.callback('Залишити відгук', 'feedback')],
            [Markup.button.callback('Мої дані', 'user_data')]
        ])
    }

    async addMenuCategoryBtns() {
        const category = await Menus.findAll({
            attributes: ['category'],
            raw: true
        });

        const categories = (data, key) => {
            return [
                ...new Map(data.map(x => [key(x), x])).values()
            ]
        }

        const listOfCategories = categories(category, key => key.category);

        const arrOfBtns = [];
        let innerArray = [];
        const arrOfCallbackData = [];
        const arrOfCallbackText = [];

        for (let i = 0; i < listOfCategories.length; i++) {
            arrOfCallbackData.push(cyrillicToTranslit({preset:'uk'}).transform(listOfCategories[i].category));
            arrOfCallbackText.push(listOfCategories[i].category);

            if (innerArray.length < 4) {
                innerArray.push(Markup.button.callback(listOfCategories[i].category, cyrillicToTranslit({preset:'uk'}).transform(listOfCategories[i].category)));

                if (i == listOfCategories.length-1) {
                    arrOfBtns.push(innerArray);
                }
            }
            else {
                arrOfBtns.push(innerArray);
                innerArray = [];
                innerArray.push(Markup.button.callback(listOfCategories[i].category, cyrillicToTranslit({preset:'uk'}).transform(listOfCategories[i].category)));
            }
        }

        arrOfBtns.push([Markup.button.callback('Назад', 'backToMainMenu')]);

        return [arrOfBtns, arrOfCallbackData, arrOfCallbackText];
    }

    async addMenuDishBtns(category) {
        const dishes = await Menus.findAll({where: {category: category}});
        const arrOfBtns = []
        let innerArray = [];
        const arrOfCallbackData = [];
        const arrOfCallbackText = [];

        for (let i = 0; i < dishes.length; i++) {
            arrOfCallbackData.push(cyrillicToTranslit({preset:'uk'}).transform(dishes[i].name));
            arrOfCallbackText.push(dishes[i].name);

            if (innerArray.length < 3) {
                innerArray.push(Markup.button.callback(dishes[i].name, cyrillicToTranslit({preset:'uk'}).transform(dishes[i].name)));

                if (i == dishes.length-1) {
                    arrOfBtns.push(innerArray);
                }
            }
            else {
                arrOfBtns.push(innerArray);
                innerArray = [];
                innerArray.push(Markup.button.callback(dishes[i].name, cyrillicToTranslit({preset:'uk'}).transform(dishes[i].name)));
            }
        }

        arrOfBtns.push([Markup.button.callback('Назад', 'backToCategory')]);

        return [arrOfBtns, arrOfCallbackData, arrOfCallbackText];
    }

    async addDishDataBtns() {
        return [
            [{text: 'Склад', callback_data: `ingr`}, {text: 'Додати в кошик', callback_data: `add`}, {text: 'Мій кошик', callback_data: 'basket'}],
            [{text: 'Назад', callback_data: 'backToMenuDish'}]
        ]
    }

    async addDishNavBtns(amount) {
        return [
            [{text: '-', callback_data: 'minus'}, {text: `${amount}`, callback_data: 'amount'}, {text: '+', callback_data: 'plus'}],
            [{text: 'Додати в кошик', callback_data: `addToBasket`}],
            [{text: 'Назад', callback_data: 'backToDishData'}]
        ]
    }

    async addBasketNavBtns() {
        return [
            [{text: 'Оформити замовлення', callback_data: 'toOrder'}, {text: 'Змінити кількість', callback_data: 'changeAmount'}, {text: 'Видалити', callback_data: 'deleteOrderElem'}],
            [{text: 'Назад', callback_data: 'backToPrev'}]
        ]
    }

    async addBasketDishesBtns(id) {
        const orderElements = await Orders.findAll({where: {user_id: id}});
        let arrOfBtns = [];
        let innerArr = [];
        
        for (const key of orderElements) {
            const orderData = await Menus.findOne({where: {id: key.product_id}});

            if (innerArr.length < 3) {
                innerArr.push(Markup.button.callback(`${orderData.dataValues.name}`, `${cyrillicToTranslit({preset:'uk'}).transform(orderData.dataValues.name)}`));

                if (orderElements.indexOf(key) == orderElements.length-1) {
                    arrOfBtns.push(innerArr);
                }
            }
            else {
                arrOfBtns.push(innerArr);
                innerArr = [];
                innerArr.push(Markup.button.callback(`${orderData.dataValues.name}`, `${cyrillicToTranslit({preset:'uk'}).transform(orderData.dataValues.name)}`));
            }
        }

        arrOfBtns.push([Markup.button.callback('Назад', 'backToBasket')]);

        return arrOfBtns;
    }

    async addHistoryDateBtns() {
        let arrOfBtns = [];
        const historyElements = await Histories.findAll({attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('createdAt')) ,'createdAt'],
        ]});

        for (const i of historyElements) {
            console.log (i.dataValues.createdAt)
            arrOfBtns.push([{text: `${i.dataValues.createdAt}`}, {callback_data: `time${historyElements.indexOf(i)}`}]);
        }

        return arrOfBtns;
    }
}

module.exports = new Navigation();
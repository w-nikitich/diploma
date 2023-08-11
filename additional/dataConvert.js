const cyrillicToTranslit = require('cyrillic-to-translit-js');
const Menus = require('../models/Menus');
const Orders = require('../models/Orders');

async function dishConvertation() {
    const listOfDishes = await Menus.findAll({attributes: ['name'], raw: true});
    const callbacksDishes = [];

    listOfDishes.forEach(el => {
        callbacksDishes.push(cyrillicToTranslit({preset:'uk'}).transform(el.name));
    });

    return [callbacksDishes, listOfDishes];
}

async function basketDataConvertation(element) {
    let string = ``;

    for (const key of element) {
        const product_id = key.dataValues.product_id;
        const orderData = await Menus.findOne({where: {id: product_id}});
        string +=`\n${orderData.dataValues.name} \\- ${key.dataValues.amount} шт\\.`;
    }

    return string;
}

module.exports = {dishConvertation, basketDataConvertation};
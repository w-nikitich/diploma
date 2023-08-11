const {Telegraf} = require('telegraf')
const Menus = require('../models/Menus');
const Orders = require('../models/Orders');

async function getOrderElement(ctx, orderButtonText) {
    const menuElement = await Menus.findOne({ where: { name: orderButtonText } });
    return Orders.findOne({ where: { user_id: ctx.from.id, product_id: menuElement.dataValues.id } });
  }

module.exports = {getOrderElement};
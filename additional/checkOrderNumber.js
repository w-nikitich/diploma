const Orders = require('../models/Orders');

async function checkOrderNumber(id, number) {
    const ordersData = await Orders.findAll({where: {user_id: id}});
    if (ordersData.length > 1) {
        ordersData.forEach(async (key) => {
            if (ordersData[0].dataValues.order_number != number) {
                key.order_number = ordersData[0].dataValues.order_number
                await key.save();
            }
        })
    }
}

module.exports = checkOrderNumber;
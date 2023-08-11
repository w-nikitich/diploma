const Orders = require('../models/Orders');

async function isEqualOrder(dish) {
    // check if in Orders exist this dish
    const orders = await Orders.findOne({where: {product_id: dish}});
    if (orders != null) {
        return orders;
    }
    else {
        return null;
    }
}

module.exports = isEqualOrder;
const Menus = require('../models/Menus');

const products = [
    {
        id: 13,
        name: "Цезар",
        photo: "Caesar.jpg",
        description: "275 г.Салат родом з Мексики",
        price: 100,
        category: "Салати",
        ingredients: "Кряче філе, помідори чері, батон, пармезан, яйця, часник, чорний перець"
    },
    {
        id: 14,
        name: "Грецький салат",
        photo: "GreekSalad.jpg",
        description: "200 г.Класичний салат з Греції",
        price: 80,
        category: "Салати",
        ingredients: "Помідори, огірки, оливки, фета, цибуля, олія, оцет"
    },
    {
        id: 15,
        name: "Маргарита",
        photo: "Margherita.jpg",
        description: "320 г.Найпопулярніша піца в світі",
        price: 120,
        category: "Піци",
        ingredients: "Томатний соус, моцарела, базилік"
    },
    {
        id: 16,
        name: "Спагетті Болоньєзе",
        photo: "SpaghettiBolognese.jpg",
        description: "350 г.Традиційні італійські макарони",
        price: 90,
        category: "Паста",
        ingredients: "Фарш, томатний соус, спагетті, цибуля, морква, сіль, перець"
    },
    {
        id: 17,
        name: "Фритатта",
        photo: "Frittata.jpg",
        description: "200 г.Італійське яєчне блюдо",
        price: 70,
        category: "Сніданки",
        ingredients: "Яйця, молоко, сир, овочі, спеції"
    },
    {
        id: 18,
        name: "Стейк з лосося",
        photo: "SalmonSteak.jpg",
        description: "250 г.Ніжний стейк з лосося",
        price: 150,
        category: "Риба",
        ingredients: "Лосось, оливкова олія, лимонний сік, спеції"
    },
    {
        id: 19,
        name: "Чікен Бургер",
        photo: "ChickenBurger.jpg",
        description: "180 г.Соковитий курячий бургер",
        price: 110,
        category: "Бургери",
        ingredients: "Куряче філе, булочка, салат, помідори, соус, сир"
    },
    {
        id: 20,
        name: "Карбонара",
        photo: "Carbonara.jpg",
        description: "350 г.Італійські макарони зі шкварками",
        price: 95,
        category: "Паста",
        ingredients: "Бекон, яйця, сир, вершки, спагетті, часник, перець"
    },
    {
        id: 21,
        name: "Маринована овочева салат",
        photo: "MarinatedVegetableSalad.jpg",
        description: "300 г.Смачна маринована овочева суміш",
        price: 85,
        category: "Салати",
        ingredients: "Огірки, морква, капуста, перець, цибуля, оцет, цукор"
    },
    {
        id: 22,
        name: "Маргарита піца",
        photo: "MargheritaPizza.jpg",
        description: "320 г.Класична італійська піца з томатами і сиром",
        price: 110,
        category: "Піци",
        ingredients: "Томатний соус, моцарела, базилік, оливкова олія"
    },
    {
        id: 23,
        name: "Креветки у часнику",
        photo: "GarlicShrimp.jpg",
        description: "200 г.Смажені креветки з ароматним часником",
        price: 130,
        category: "Морепродукти",
        ingredients: "Креветки, часник, масло, лимонний сік, спеції"
    },
    {
        id: 24,
        name: "Цибульний суп",
        photo: "OnionSoup.jpg",
        description: "300 г.Ароматний суп з цибулі",
        price: 75,
        category: "Супи",
        ingredients: "Цибуля, бульйон, вершки, сир, хліб"
    },
    {
        id: 25,
        name: "Кальмари у паніровці",
        photo: "BreadedCalamari.jpg",
        description: "180 г.Смажені кальмари в хрусткій паніровці",
        price: 120,
        category: "Морепродукти",
        ingredients: "Кальмари, борошно, яйця, спеції, соус"
    },
    {
        id: 26,
        name: "Картопля по-домашньому",
        photo: "HomestylePotatoes.jpg",
        description: "200 г.Смачна смажена картопля",
        price: 60,
        category: "Гарніри",
        ingredients: "Картопля, олія, спеції, зелень"
    },
    {
        id: 27,
        name: "Чізкейк",
        photo: "Cheesecake.jpg",
        description: "150 г.Ніжний десерт зі сметановим сиром",
        price: 80,
        category: "Десерти",
        ingredients: "Сметановий сир, цукор, яйця, вершки, ваніль, печиво"
    }
];

async function addProducts() {
    for (const product of products) {
        await Menus.create({
            id: product.id,
            name: product.name,
            photo: product.photo,
            description: product.description,
            price: product.price,
            category: product.category,
            ingredients: product.ingredients,
        })
    }
};

module.exports = {addProducts};
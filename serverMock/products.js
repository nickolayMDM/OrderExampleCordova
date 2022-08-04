import validators from "../resources/helpers/validators";
import translatorAdapter from "../resources/adapters/translatorAdapter";

let list = [
    {
        ID: 0,
        name: {
            en: "Margarita",
            ua: "Маргарита"
        },
        description: {
            en: "Tomato sauce, mozzarella cheese and ripe tomatoes",
            ua: "Соус томатний, сир моцарела та стиглі томати."
        },
        imageName: "pizzaMargarita",
        categoryID: 0,
        price: 245,
        inWishlist: false,
        inCart: 0
    },
    {
        ID: 1,
        name: {
            en: "Four Seasons",
            ua: "Чотири Сезони"
        },
        description: {
            en: "Tomato sauce, mozzarella cheese, ripe tomatoes, champignon mushrooms, appetizing salami, dorblyu cheese that just melts in your mouth.",
            ua: "Соус томатний, сир моцарела, стиглі томати, гриби печериці, апетитна салямі, сир дорблю, що просто тане у роті."
        },
        imageName: "pizza4seasons",
        categoryID: 0,
        price: 315,
        inWishlist: false,
        inCart: 0
    },
    {
        ID: 2,
        name: {
            en: "Vegetarian",
            ua: "Вегетаріанська"
        },
        description: {
            en: "Tomato sauce, mozzarella cheese, champignon mushrooms, ripe tomatoes, sweet peppers, sweet corn, pickled blue onions, olives, olives and fresh herbs.",
            ua: "Соус томатний, сир моцарела, гриби печериці, стиглі томати, солодкий перець, солодка кукурудза, маринована синя цибуля, маслини, оливки та свіжа зелень."
        },
        imageName: "pizzaVegetarian",
        categoryID: 0,
        price: 319,
        inWishlist: false,
        inCart: 0
    },
    {
        ID: 3,
        name: {
            en: "Family",
            ua: "Сімейна"
        },
        description: {
            en: "Tomato sauce, mozzarella cheese, juicy ham and sweet corn, champignon mushrooms, smoked chicken fillet, fresh herbs.",
            ua: "Соус томатний, сир моцарела, соковита шинка та солодка кукурудза, гриби печериці, копчене куряче філе, свіжа зелень."
        },
        imageName: "pizzaFamily",
        categoryID: 0,
        price: 345,
        inWishlist: false,
        inCart: 0
    },
    {
        ID: 4,
        name: {
            en: "Dragon",
            ua: "Дракон"
        },
        description: {
            en: "Tomato sauce, mozzarella, champignons, tomato, salami, jalapeno, french herbs.",
            ua: "Соус томатний, моцарела, гриби печериці, помідор, салямі, перець халапеньо, французькі трави."
        },
        imageName: "pizzaDragon",
        categoryID: 0,
        price: 325,
        inWishlist: false,
        inCart: 0
    },
    {
        ID: 5,
        name: {
            en: "Noodles with vegetables",
            ua: "Локшина з овочами"
        },
        description: {
            en: "Transparent noodles, Thai sauce, soft tofu cheese, onions, ginger, fresh carrots, sweet peppers, broccoli, shiitake mushrooms, sesame seeds, green onions and spicy garlic oil",
            ua: "Локшина прозора, тайський соус, ніжний сир тофу, ріпчаста цибуля, імбир, свіжа морква, солодкий перець, капуста броколі, гриби шиітаке, кунжут, зелена цибуля та пікантне часникове масло"
        },
        imageName: "wokVegetables",
        categoryID: 1,
        price: 145,
        inWishlist: false,
        inCart: 0
    },
    {
        ID: 6,
        name: {
            en: "Noodles with chicken",
            ua: "Локшина з куркою"
        },
        description: {
            en: "Transparent noodles, Thai sauce, tender chicken fillet, onions, ginger, fresh carrots, sweet peppers, green peas, shiitake mushrooms, sesame seeds, green onions and spicy garlic oil",
            ua: "Локшина прозора, тайський соус, ніжне куряче філе, ріпчаста цибуля, імбир, свіжа морква, солодкий перець, стручковий горошок, гриби шиітаке, кунжут, зелена цибуля та пікантне часникове масло"
        },
        imageName: "wokChicken",
        categoryID: 1,
        price: 155,
        inWishlist: false,
        inCart: 0
    },
    {
        ID: 7,
        name: {
            en: "Noodles with pork",
            ua: "Локшина зі свининою"
        },
        description: {
            en: "Transparent noodles, Thai sauce, juicy pork, onions, ginger, fresh carrots, sweet peppers, corn on the cob, shiitake mushrooms, sesame seeds, green onions and spicy garlic oil",
            ua: "Локшина прозора, тайський соус, соковита свинина, ріпчаста цибуля, імбир, свіжа морква, солодкий перець, початки кукурудзи, гриби шиітаке, кунжут, зелена цибуля та пікантне часникове масло"
        },
        imageName: "wokPork",
        categoryID: 1,
        price: 165,
        inWishlist: false,
        inCart: 0
    },
    {
        ID: 8,
        name: {
            en: "Noodles with veal",
            ua: "Локшина з телятиною"
        },
        description: {
            en: "Transparent noodles, Thai sauce, hot veal, onions, ginger, fresh carrots, sweet peppers, broccoli, shiitake mushrooms, sesame seeds, green onions and spicy garlic oil",
            ua: "Локшина прозора, тайський соус, гаряча телятина, ріпчаста цибуля, імбир, свіжа морква, солодкий перець, капуста броколі, гриби шиітаке, кунжут, зелена цибуля та пікантне часникове масло"
        },
        imageName: "wokVeal",
        categoryID: 1,
        price: 165,
        inWishlist: false,
        inCart: 0
    }
];
let inCartTotal = 0;
let inWishlistTotal = 0;

const getPage = ({page = 1, limit = 5, searchQuery, categoryID, tab = null} = {}) => {
    let resultList = list;
    if (validators.isInt(categoryID)) {
        resultList = resultList.reduce((accumulator, value) => {
            if (validators.isInt(value.categoryID) && value.categoryID === categoryID) {
                accumulator.push(value);
            }

            return accumulator;
        }, []);
    } else if (!validators.isPopulatedString(searchQuery)) {
        resultList = resultList.reduce((accumulator, value) => {
            if (!validators.isBoolean(value.shouldShowOutsideOfCategory) || value.shouldShowOutsideOfCategory === true) {
                accumulator.push(value);
            }

            return accumulator;
        }, []);
    }

    if (validators.isString(searchQuery)) {
        const searchRegExp = new RegExp(".*" + searchQuery + ".*", "i");
        const locale = translatorAdapter.getCurrentLocale();

        resultList = resultList.reduce((accumulator, value) => {
            if (searchRegExp.test(value.name[locale]) || searchRegExp.test(value.description[locale])) {
                accumulator.push(value);
            }

            return accumulator;
        }, []);
    }

    if (!validators.isNull(tab)) {
        switch (tab) {
            case "cart":
                resultList = resultList.reduce((accumulator, value) => {
                    if (validators.isPositiveInteger(value.inCart)) {
                        accumulator.push(value);
                    }

                    return accumulator;
                }, []);
                break;
            case "wishlist":
                resultList = resultList.reduce((accumulator, value) => {
                    if (!validators.isBoolean(value.inWishlist) || value.inWishlist === true) {
                        accumulator.push(value);
                    }

                    return accumulator;
                }, []);
                break;
        }
    }

    if (validators.isPositiveInteger(page) && validators.isPositiveInteger(limit)) {
        const skip = (page === 1) ? 0 : (limit * (page - 1)) - 1;
        const end = (skip + limit > resultList.length) ? resultList.length : skip + limit;
        if (skip > resultList.length) {
            return [];
        }

        resultList = resultList.slice(skip, end);
    }

    if (validators.isPositiveInteger(page) && validators.isPositiveInteger(limit)) {
        const skip = (page === 1) ? 0 : (limit * (page - 1)) - 1;
        const end = (skip + limit > resultList.length) ? resultList.length : skip + limit;
        if (skip > resultList.length) {
            return [];
        }

        resultList = resultList.slice(skip, end);
    }

    return resultList;
};

const getByID = (ID) => {
    return list[ID];
};

const addToCart = (item) => {
    inCartTotal++;
    if (!validators.isInt(list[item.ID].inCart)) {
        return list[item.ID].inCart = 1;
    }

    return list[item.ID].inCart++;
};

const reduceInCart = (item) => {
    if (!validators.isInt(list[item.ID].inCart) || list[item.ID].inCart === 0) {
        return list[item.ID].inCart = 0;
    }

    inCartTotal--;
    return list[item.ID].inCart--;
};

const removeFromCart = (item) => {
    inCartTotal -= list[item.ID].inCart;
    return list[item.ID].inCart = 0;
};

const clearCart = () => {
    inCartTotal = 0;

    for (let key in list) {
        if (!list.hasOwnProperty(key)) continue;

        list[key].inCart = 0;
    }
};

const addToWishlist = (item) => {
    inWishlistTotal++;
    return list[item.ID].inWishlist = true;
};

const removeFromWishlist = (item) => {
    inWishlistTotal--;
    return list[item.ID].inWishlist = false;
};

const getInCartTotal = () => {
    return inCartTotal;
};

const getInCartTotalPrice = () => {
    const totalPrice = list.reduce((accumulator, value) => {
        if (!validators.isPositiveInteger(value.inCart)) {
            return accumulator;
        }

        accumulator += value.price * value.inCart;
        return accumulator;
    }, 0);

    return totalPrice;
};

const getInWishlistTotal = () => {
    return inWishlistTotal;
};

export default {
    getPage,
    addToCart,
    reduceInCart,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    getInCartTotal,
    getInCartTotalPrice,
    getInWishlistTotal
};
import productsMock from "../../serverMock/products";
import usersMock from "../../serverMock/users";
import categoriesMock from "../../serverMock/categories";

const errorPrefix = "serverRequester: ";

let _validators = null;
let _notify = null;

const serverRequester = {
    initialize: async ({validators, notify}) => {
        _validators = validators;
        _notify = notify;
    },

    getUserByID: async ({userID}, {notifyOnError = true} = {}) => {
        if (!_validators.isPositiveInteger(userID)) {
            throw Error(errorPrefix + "user ID must be a positive integer");
        }

        try {
            return usersMock.getUserByID(userID);
        } catch (error) {
            if (notifyOnError) {
                return _displayConnectionError(error)
            }
        }
    },
    getUserByPassword: async ({name, password}) => {
        let params = {
            name,
            password
        };

        // return await _requestAdapter.get({
        //     url: host + "getUserByPassword",
        //     params,
        //     options: {
        //         notifyOnError: false
        //     }
        // });
    },

    getProductsPage: async ({page, limit, searchQuery, categoryID, tab}, {notifyOnError = true} = {}) => {
        let params = {};
        if (_validators.isPositiveInteger(page)) {
            params.page = page;
        }
        if (_validators.isPositiveInteger(limit)) {
            params.limit = limit;
        }
        if (_validators.isString(searchQuery)) {
            params.searchQuery = searchQuery;
        }
        if (_validators.isInt(categoryID)) {
            params.categoryID = categoryID;
        }
        if (_validators.isPopulatedString(tab)) {
            params.tab = tab;
        }

        try {
            return productsMock.getPage(params);
        } catch (error) {
            if (notifyOnError) {
                return _displayConnectionError(error)
            }
        }
    },

    getCategories: () => {
        return categoriesMock.getAll();
    },

    addToWishlist: (item) => {
        productsMock.addToWishlist(item);
    },
    removeFromWishlist: (item) => {
        productsMock.removeFromWishlist(item);
    },

    addToCart: (item) => {
        productsMock.addToCart(item);
    },
    reduceInCart: (item) => {
        productsMock.reduceInCart(item);
    },
    removeFromCart: (item) => {
        productsMock.removeFromCart(item);
    },
    clearCart: () => {
        productsMock.clearCart();
    },
    getInCartTotal: () => {
        return productsMock.getInCartTotal();
    },
    getInCartTotalPrice: () => {
        return productsMock.getInCartTotalPrice();
    },
    getInWishlistTotal: () => {
        return productsMock.getInWishlistTotal();
    }
};

export default serverRequester;

const _displayConnectionError = (error) => {
    if (
        !_validators.isPopulatedObject(error.response)
        || !_validators.isNumeric(error.response.status)
        || !_validators.isPopulatedString(error.response.statusText)
    ) {
        return _notify.error("Connection error");
    }

    return _notify.error("Connection error: " + error.response.status + " " + error.response.statusText);
};
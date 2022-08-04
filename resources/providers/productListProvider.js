const errorPrefix = "productListProvider: ";

const updatedEventName = "productListUpdated";

let _eventEmitter = null;
let _validators = null;
let isUpdating = false;

let categoryID = null;
let searchQuery = null;
let page = 1;
let limit = 20;
let tab = null;

const throwError = (message) => {
    throw Error(errorPrefix + message);
};

const emitUpdatedEvent = (item) => {
    _eventEmitter.emit(updatedEventName, item);
};

let productListProvider = {
    initialize: ({eventEmitter, validators}) => {
        _eventEmitter = eventEmitter;
        _validators = validators;
    },

    isInitialized: () => {
        return _eventEmitter !== null && _validators !== null;
    },

    isUpdating: () => {
        return isUpdating;
    },

    setIsUpdating: (value) => {
        if (_validators.isBoolean(value)) {
            isUpdating = value;
        }
    },

    clearVariables: () => {
        if (!productListProvider.isInitialized()) {
            throwError("not initialized");
        }
        if (productListProvider.isUpdating()) {
            throwError("cannot clear while updating");
        }

        categoryID = null;
        searchQuery = null;
        page = 1;
        limit = 20;

        emitUpdatedEvent();
    },

    getUpdatedEventName: () => {
        return updatedEventName;
    },

    setSearchQuery: (value, {shouldUpdate = true} = {}) => {
        if (!productListProvider.isInitialized()) {
            throwError("not initialized");
        }
        if (!(_validators.isString(value) || _validators.isNull(value))) {
            throwError("search query must be a string or null");
        }

        searchQuery = value;

        if (shouldUpdate) {
            emitUpdatedEvent();
        }
    },

    getSearchQuery: () => {
        return searchQuery;
    },

    setPage: (value, {shouldUpdate = true} = {}) => {
        if (!productListProvider.isInitialized()) {
            throwError("not initialized");
        }
        if (!_validators.isPositiveInteger(value)) {
            throwError("page must be a positive integer");
        }

        page = value;

        if (shouldUpdate) {
            emitUpdatedEvent();
        }
    },

    getPage: () => {
        return page;
    },

    setLimit: (value, {shouldUpdate = true} = {}) => {
        if (!productListProvider.isInitialized()) {
            throwError("not initialized");
        }
        if (!_validators.isPositiveInteger(value)) {
            throwError("limit must be a positive integer");
        }

        limit = value;

        if (shouldUpdate) {
            emitUpdatedEvent();
        }
    },

    getLimit: () => {
        return limit;
    },

    setCategoryID: (value, {shouldUpdate = true} = {}) => {
        if (!productListProvider.isInitialized()) {
            throwError("not initialized");
        }
        if (!(_validators.isInt(value) || _validators.isNull(value))) {
            throwError("categoryID must be a integer or null");
        }

        categoryID = value;

        if (shouldUpdate) {
            emitUpdatedEvent();
        }
    },

    getCategoryID: () => {
        return categoryID;
    },

    setTab: (value, {shouldUpdate = true} = {}) => {
        if (!productListProvider.isInitialized()) {
            throwError("not initialized");
        }
        if (!(_validators.isPopulatedString(value) || _validators.isNull(value))) {
            throwError("tab must be a populated string or null");
        }

        tab = value;

        if (shouldUpdate) {
            emitUpdatedEvent();
        }
    },

    getTab: () => {
        return tab;
    },

    addProviderListener: (component) => {
        _eventEmitter.addListener(updatedEventName, () => {
            component.forceUpdate();
        });
    }
};

export default productListProvider;
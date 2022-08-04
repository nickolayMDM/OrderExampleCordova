const errorPrefix = "accountProvider: ";
const eventName = "updateAccount";

let _eventEmitter = null;
let _validators = null;

let fullname = "";
let phone = "";
let address = "";

const throwError = (message) => {
    throw Error(errorPrefix + message);
};

const emitEvent = () => {
    _eventEmitter.emit(eventName);
};

let accountProvider = {
    initialize: ({eventEmitter, validators}) => {
        _eventEmitter = eventEmitter;
        _validators = validators;
    },

    isInitialized: () => {
        return _eventEmitter !== null && _validators !== null;
    },

    getFullname: () => {
        return fullname;
    },

    getPhone: () => {
        return phone;
    },

    getAddress: () => {
        return address;
    },

    getDataObject: () => {
        return {
            fullname: accountProvider.getFullname(),
            phone: accountProvider.getPhone(),
            address: accountProvider.getAddress()
        };
    },

    clearData: () => {
        fullname = "";
        phone = "";
        address = "";

        return accountProvider.getDataObject();
    },

    setFromObject: (object, {clearBefore = false} = {}) => {
        if (!_validators.isPopulatedObject(object)) {
            throwError("object parameter must be a non-empty object");
        }
        if (clearBefore) {
            accountProvider.clearData();
        }

        accountProvider.setFullname(object.fullname, {shouldEmitEvent: false});
        accountProvider.setPhone(object.phone, {shouldEmitEvent: false});
        accountProvider.setAddress(object.address, {shouldEmitEvent: false});

        emitEvent();
    },

    setFullname: (value, {shouldEmitEvent = true} = {}) => {
        if (!_validators.isString(value)) {
            throwError("fullname must be a string");
        }

        fullname = value;

        if (shouldEmitEvent) {
            emitEvent();
        }

        return fullname;
    },

    setPhone: (value, {shouldEmitEvent = true} = {}) => {
        if (!_validators.isUAPhone(value)) {
            throwError("phone must be a valid ukrainian format phone number");
        }

        phone = value;

        if (shouldEmitEvent) {
            emitEvent();
        }

        return phone;
    },

    setAddress: (value, {shouldEmitEvent = true} = {}) => {
        if (!_validators.isString(value)) {
            throwError("address must be a string");
        }

        address = value;

        if (shouldEmitEvent) {
            emitEvent();
        }

        return address;
    },

    applyAccountUpdates: (component) => {
        _eventEmitter.addListener(eventName, () => {
            component.forceUpdate();
        });
    }
};

export default accountProvider;
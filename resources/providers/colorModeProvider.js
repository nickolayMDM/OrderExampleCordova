const eventName = "updateColorMode";

let colorModes = {};
let defaultColorModeName = "";
let currentColorMode = "";
let _dispatch = null;
let _storage = null;
let _validators = null;
let _eventEmitter = null;
let firstModeSet = false;

const emitEvent = () => {
    _eventEmitter.emit(eventName);
};

let colorModeProvider = {
    initialize: ({dispatch, initialModes = {}, defaultMode, validators, eventEmitter}) => {
        _dispatch = dispatch;
        _validators = validators;
        _eventEmitter = eventEmitter;
        defaultColorModeName = defaultMode;

        for (let key in initialModes) {
            if (!initialModes.hasOwnProperty(key)) continue;

            colorModeProvider.defineColorMode(key, initialModes[key])
        }

        if (!firstModeSet) {
            colorModeProvider.switchTo({
                name: defaultColorModeName
            })
        }
    },

    isInitialized: () => {
        return _eventEmitter !== null && _validators !== null && Object.keys(colorModes).length > 0;
    },

    defineColorMode: (name, options) => {
        if (!_validators.isObject(options)) {
            options = {};
        }

        colorModes[name] = options;

        if (options.activate === true) {
            const isSwitched = colorModeProvider.switchTo({
                name
            });
            if (isSwitched) {
                firstModeSet = true;
            }
        }
    },

    isNotFound: (name) => {
        return !Object.keys(colorModes).includes(name);
    },

    isModeValid: (name) => {
        return _validators.isDefined(colorModes[name]);
    },

    switchTo: ({name, shouldEmitEvent = true} = {}) => {
        if (
            currentColorMode === name
            || !colorModeProvider.isInitialized()
            || !_validators.isPopulatedString(name)
            || colorModeProvider.isNotFound(name)
        ) {
            return false;
        }

        currentColorMode = name;

        if (shouldEmitEvent) {
            emitEvent();
        }

        return true;
    },

    getColorModes: () => {
        return colorModes;
    },

    getCurrentColorMode: () => {
        return currentColorMode;
    },

    getModeOptions: (name) => {
        return colorModes[name];
    },

    applyTranslationUpdates: (component) => {
        _eventEmitter.addListener(eventName, () => {
            component.forceUpdate();
        });
    }
};

export default colorModeProvider;
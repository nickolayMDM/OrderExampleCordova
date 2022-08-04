//TODO: transform this into a separate module
let _transformStringWithDelimitersToArray, _findNestedPropertyInObject, _replacePlaceholders, _validators,
    _eventEmitter;
let isInitialized = false;
let currentLocale = "";
let translationData = {};
let availableLocales = {};

const initialize = async (
    {
        transformStringWithDelimitersToArray,
        findNestedPropertyInObject,
        replacePlaceholders,
        eventEmitter,
        validators,
        serverRequester
    }
) => {
    _transformStringWithDelimitersToArray = transformStringWithDelimitersToArray;
    _findNestedPropertyInObject = findNestedPropertyInObject;
    _replacePlaceholders = replacePlaceholders;
    _eventEmitter = eventEmitter;
    _validators = validators;

    isInitialized = true;
};

const setAvailableLocales = (locales) => {
    if (!_validators.isPopulatedObject(locales)) {
        return false;
    }

    availableLocales = locales;
};

const setLocale = async ({localeCode}) => {
    let importedData = await import("./translations/" + localeCode);
    translationData = importedData.default;
    currentLocale = localeCode;

    _eventEmitter.emit("changeLanguage");
};

const getCurrentLocale = () => {
    return currentLocale;
};

const translateList = (list, variables) => {
    if (!isInitialized) {
        throw new Error("Translator is not initialized");
    }

    const locale = getCurrentLocale();
    let string = list[locale];

    string = applyVariables(string, variables);

    return string;
};

const translate = (string, domain, variables) => {
    if (!isInitialized) {
        throw new Error("Translator is not initialized");
    }

    if (typeof domain !== "undefined") {
        let keys = _transformStringWithDelimitersToArray(".", domain);
        keys.push(string);
        let result = _findNestedPropertyInObject(translationData, keys);
        if (typeof result === "string") {
            string = result;
        }
    } else if (typeof translationData[string] !== "undefined") {
        string = translationData[string];
    }

    string = applyVariables(string, variables);

    return string;
};

const applyVariables = (inputString, variables) => {
    if (!_validators.isPopulatedObject(variables) || inputString.indexOf("{") === -1 || inputString.indexOf("}") === -1) {
        return inputString;
    }

    return _replacePlaceholders({
        body: inputString,
        replacements: variables
    });
};

const applyTranslationUpdates = (component) => {
    _eventEmitter.addListener("changeLanguage", () => {
        component.forceUpdate();
    });
};

const getAvailableLocales = () => {
    return availableLocales;
};

export {
    initialize,
    setLocale,
    translate,
    translateList,
    setAvailableLocales,
    applyTranslationUpdates,
    getAvailableLocales,
    getCurrentLocale
};
export default {
    initialize,
    setLocale,
    translate,
    translateList,
    setAvailableLocales,
    applyTranslationUpdates,
    getAvailableLocales,
    getCurrentLocale
};
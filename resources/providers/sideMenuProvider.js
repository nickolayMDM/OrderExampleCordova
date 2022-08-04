import validators from "../helpers/validators";

const eventName = "sideMenusUpdated";

/**
 * scene options:
 * activate: boolean - display this scene right after defining it
 */
let menus = {};
let _eventEmitter = null;
let _validators = null;
let currentlyOpenMenu = "";
let displayedRightSideMenu = "";
let displayedLeftSideMenu = "";

const emitEvent = () => {
    _eventEmitter.emit(eventName);
};

let sideMenuProvider = {
    initialize: ({eventEmitter, validators}) => {
        _eventEmitter = eventEmitter;
        _validators = validators;
    },

    isInitialized: () => {
        return Object.keys(menus).length > 0 && _eventEmitter !== null;
    },

    defineMenu: (menuName, options) => {
        if (!validators.isObject(options)) {
            options = {};
        }

        menus[menuName] = options;
    },

    exists: (menuName) => {
        return Object.keys(menus).includes(menuName);
    },

    open: ({name}) => {
        if (
            !sideMenuProvider.isInitialized()
            || !_validators.isPopulatedString(name)
            || !sideMenuProvider.exists(name)
        ) {
            return false;
        }

        currentlyOpenMenu = name;
        emitEvent();
    },

    close: () => {
        if (
            !sideMenuProvider.isInitialized()
            || !_validators.isPopulatedString(currentlyOpenMenu)
        ) {
            return false;
        }

        currentlyOpenMenu = "";
        emitEvent();
    },

    show: ({name}) => {
        if (
            !sideMenuProvider.isInitialized()
            || !_validators.isPopulatedString(name)
            || !sideMenuProvider.exists(name)
            || menus[name].displayed === true
        ) {
            return false;
        }

        if (sideMenuProvider.isMenuOnRight({name})) {
            displayedRightSideMenu = name;
        } else {
            displayedLeftSideMenu = name;
        }
        menus[name].displayed = true;

        emitEvent();
    },

    hide: ({name}) => {
        if (
            !sideMenuProvider.isInitialized()
            || !_validators.isPopulatedString(name)
            || !sideMenuProvider.exists(name)
            || menus[name].displayed !== true
        ) {
            return false;
        }

        if (sideMenuProvider.isMenuOnRight({name})) {
            displayedRightSideMenu = "";
        } else {
            displayedLeftSideMenu = "";
        }
        menus[name].displayed = false;

        emitEvent();
    },

    isMenuOnRight: ({name}) => {
        return (menus[name].isRightSide === true);
    },

    isMenuDisplayed: (name) => {
        if (menus[name].isRightSide === true) {
            return (displayedRightSideMenu === name);
        }

        return (displayedLeftSideMenu === name);
    },

    getCurrentlyOpenMenuName: () => {
        return currentlyOpenMenu;
    },

    getCurrentMenuOptions: () => {
        return menus[currentlyOpenMenu];
    },

    getEventName: () => {
        return eventName;
    },

    addProviderListener: (component) => {
        _eventEmitter.addListener(sideMenuProvider.getEventName(), () => {
            component.forceUpdate();
        });
    }
};

export default sideMenuProvider;
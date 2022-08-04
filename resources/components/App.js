import React, {Component} from 'react';
import config from "../config";
import translator from "../adapters/translatorAdapter";
import serverRequester from "../adapters/serverRequesterAdapter";
import eventEmitter from "../adapters/eventAdapter"
import modalProvider from '../providers/modalProvider';
import productListProvider from '../providers/productListProvider';
import sceneProvider from '../providers/sceneProvider';
import colorModeProvider from '../providers/colorModeProvider';
import accountProvider from '../providers/accountProvider';
import sideMenuProvider from '../providers/sideMenuProvider';
import {NotificationContainer, notify} from '../adapters/notificationAdapter';
import objectHelpers from "../helpers/objects";
import stringHelpers from "../helpers/strings";
import validators from "../helpers/validators";

import "../styles/App.scss";
import 'react-toastify/dist/ReactToastify.min.css';

import AppContainer from "./AppContainer";
import ProductListScene from "./scenes/ProductListScene";
import SettingsScene from "./scenes/SettingsScene";
import ControlMenu from "./ControlMenu";
import ModalBackground from "./commons/Modal/ModalBackground";
import LoadingIcon from "./commons/LoadingIcon";
import ConfirmOrderModal from "./modals/ConfirmOrderModal";
import OrderThankyouModal from "./modals/OrderThankyouModal";
import CategoriesSideMenu from "./sideMenus/CategoriesSideMenu";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstLoad: true
        };
    }

    async initializeTranslator() {
        await translator.initialize({
            transformStringWithDelimitersToArray: objectHelpers.transformStringWithDelimitersToArray,
            findNestedPropertyInObject: objectHelpers.findNestedPropertyInObject,
            replacePlaceholders: stringHelpers.replacePlaceholders,
            validators,
            eventEmitter
        });
        translator.setAvailableLocales(config.locales);

        await translator.setLocale({
            localeCode: config.defaultLangISO
        });
    }

    async initializeColorModes() {
        let initialModes = {
            bright: {
                label: "Bright"
            },
            dark: {
                label: "Dark"
            }
        };

        colorModeProvider.initialize({
            initialModes,
            defaultMode: "bright",
            validators,
            eventEmitter
        });
    }

    async componentDidMount() {
        await serverRequester.initialize({
            validators,
            notify
        });

        sceneProvider.initialize({eventEmitter});
        modalProvider.initialize({
            eventEmitter,
            validators
        });
        productListProvider.initialize({
            eventEmitter,
            validators
        });

        accountProvider.initialize({
            eventEmitter,
            validators,
            translator
        });
        sideMenuProvider.initialize({
            eventEmitter,
            validators
        });
        await this.initializeColorModes();
        await this.initializeTranslator();

        this.setState({
            firstLoad: false
        });

        eventEmitter.emit("switchTab", "menu");
    }

    _renderLoading() {
        return (
            <div id="app" className="app-mode-bright app-loading">
                <LoadingIcon size="2x"/>
            </div>
        );
    }

    _renderApp() {
        return (
            <AppContainer>
                <ProductListScene activate={true}/>
                <SettingsScene/>
                <ControlMenu/>

                <CategoriesSideMenu/>

                <ModalBackground/>
                <ConfirmOrderModal/>
                <OrderThankyouModal/>
            </AppContainer>
        );
    }

    _renderContents() {
        if (this.state.firstLoad) {
            return this._renderLoading();
        }

        return this._renderApp();
    }

    render() {
        return (
            <div>
                {this._renderContents()}
                <NotificationContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                />
            </div>
        );
    }
}

export default App;
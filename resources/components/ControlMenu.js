import React, {Component} from 'react';
import eventEmitter from "../adapters/eventAdapter";
import productListProvider from "../providers/productListProvider";
import validators from "../helpers/validators";
import sceneProvider from "../providers/sceneProvider";

import "../styles/ControlMenu.scss";

import HomeButton from "./ControlMenu/HomeButton";
import SearchButton from "./ControlMenu/SearchButton";
import CartButton from "./ControlMenu/CartButton";
import WishlistButton from "./ControlMenu/WishlistButton";
import SettingsButton from "./ControlMenu/SettingsButton";
import SearchInput from "./ControlMenu/SearchInput";
import ConfirmOrder from "./ControlMenu/ConfirmOrder";

class ControlMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPopupShown: false,
            customPopupSize: null
        };

        this.searchInputRef = React.createRef();
        this.tabsWithControlPopup = {
            "search": null,
            "cart": 69
        };

        eventEmitter.addListener("switchTab", (tab) => {
            if (validators.isWithin(tab, Object.keys(this.tabsWithControlPopup))) {

                this.showControlPopup(this.tabsWithControlPopup[tab]);
                eventEmitter.emit("showControlPopup", tab);
                return;
            }

            this.hideControlPopup();
        });
        eventEmitter.addListener(sceneProvider.getEventName(), () => {
            const currentSceneName = sceneProvider.getCurrentSceneName();

            if (currentSceneName !== "productList") {
                this.hideControlPopup();
            }
        });
    }

    hideControlPopup() {
        this.setState({
            isPopupShown: false,
            popupCustomSize: null
        });
    }

    showControlPopup(customPopupSize) {
        let newState = {
            isPopupShown: true,
            customPopupSize
        };

        this.setState(newState);
    }

    toggleControlPopup() {
        let newState = {
            isPopupShown: !this.state.isPopupShown
        };

        if (!this.state.isPopupShown) {
            newState.searchInputHeight = this.searchInputRef.current.containerRef.current.offsetHeight;
        } else {
            productListProvider.setSearchQuery(null);
        }

        this.setState(newState);
    }

    getClassName() {
        let classNameString = "control-menu";
        if (this.state.isPopupShown) {
            classNameString += " control-menu-opened";
        }
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    getStyle() {
        let result = {};
        if (!this.state.isPopupShown) {
            return result;
        }

        if (validators.isPositiveInteger(this.state.customPopupSize)) {
            result.paddingTop = this.state.customPopupSize + "px";
        }

        return result;
    }

    render() {
        return (
            <div style={this.getStyle()} className={this.getClassName()}>
                <div className="control-menu-buttons-container">
                    <HomeButton/>
                    <SearchButton/>
                    <CartButton/>
                    <WishlistButton/>
                    <SettingsButton/>
                </div>

                <SearchInput/>
                <ConfirmOrder/>
            </div>
        );
    }
}

export default ControlMenu;
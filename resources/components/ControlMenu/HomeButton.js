import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import productListProvider from "../../providers/productListProvider";
import eventEmitter from "../../adapters/eventAdapter";
import sceneProvider from "../../providers/sceneProvider";

import Svg from "../commons/Svg";

import homeImage from "../../images/menu.svg";

class HomeButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    gotoHome() {
        sceneProvider.switchToScene({
            name: "productList"
        });
        productListProvider.setSearchQuery(null, {shouldUpdate: false});
        productListProvider.setCategoryID(null, {shouldUpdate: false});
        productListProvider.setTab("menu");
        eventEmitter.emit("switchTab", "menu");
    }

    render() {
        return (
            <div className="home-button" onClick={this.gotoHome}>
                <Svg src={homeImage} width="30" height="30" />
                <p className="description-text">{translate("To Menu", "Actions")}</p>
            </div>
        );
    }
}

export default HomeButton;
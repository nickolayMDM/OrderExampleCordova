import React, {Component} from 'react';
import eventEmitter from '../../adapters/eventAdapter';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import productListProvider from "../../providers/productListProvider";
import serverRequester from "../../adapters/serverRequesterAdapter";
import {notify} from '../../adapters/notificationAdapter';
import sceneProvider from "../../providers/sceneProvider";

import Svg from "../commons/Svg";

import WishlistImage from "../../images/favourite.svg";

class WishlistButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inCartTotal: 0
        };

        applyTranslationUpdates(this);
    }

    async openWishlistTab() {
        if (serverRequester.getInWishlistTotal() <= 0) {
            return notify.error(translate("Your wishlist is empty", "Errors"));
        }

        sceneProvider.switchToScene({
            name: "productList"
        });
        productListProvider.setSearchQuery(null, {shouldUpdate: false});
        productListProvider.setCategoryID(null, {shouldUpdate: false});
        productListProvider.setTab("wishlist");
        eventEmitter.emit("switchTab", "wishlist");
    }

    render() {
        return (
            <div className="wishlist-button" onClick={this.openWishlistTab.bind(this)}>
                <Svg src={WishlistImage} width="26" height="26" />
                <p className="description-text">{translate("Wishlist", "General")}</p>
            </div>
        );
    }
}

export default WishlistButton;
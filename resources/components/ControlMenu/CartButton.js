import React, {Component} from 'react';
import eventEmitter from '../../adapters/eventAdapter';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import productListProvider from "../../providers/productListProvider";
import serverRequester from "../../adapters/serverRequesterAdapter";
import {notify} from '../../adapters/notificationAdapter';
import sceneProvider from "../../providers/sceneProvider";

import Svg from "../commons/Svg";

import CartImage from "../../images/cart.svg";

class CartButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inCartTotal: 0
        };

        applyTranslationUpdates(this);
        eventEmitter.addListener(productListProvider.getUpdatedEventName(), () => {
            const inCartTotal = serverRequester.getInCartTotal();

            this.setState({
                inCartTotal
            });
        });
    }

    async openCartTab() {
        if (serverRequester.getInCartTotal() <= 0) {
            return notify.error(translate("Your cart is empty", "Errors"));
        }

        sceneProvider.switchToScene({
            name: "productList"
        });
        productListProvider.setSearchQuery(null, {shouldUpdate: false});
        productListProvider.setCategoryID(null, {shouldUpdate: false});
        productListProvider.setTab("cart");
        eventEmitter.emit("switchTab", "cart");
    }

    _renderInCartTotalNumber() {
        if (this.state.inCartTotal <= 0) {
            return "";
        }

        return (<div className="in-cart-total">
            {this.state.inCartTotal}
        </div>);
    }

    render() {
        return (
            <div className="cart-button" onClick={this.openCartTab.bind(this)}>
                <Svg src={CartImage} width="50" height="50" />
                <p className="description-text">{translate("Cart", "General")}</p>
                {this._renderInCartTotalNumber()}
            </div>
        );
    }
}

export default CartButton;
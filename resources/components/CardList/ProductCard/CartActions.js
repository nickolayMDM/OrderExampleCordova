import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";
import serverRequester from "../../../adapters/serverRequesterAdapter";
import eventEmitter from "../../../adapters/eventAdapter"
import productListProvider from "../../../providers/productListProvider";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons'

import Button from "../../commons/Button";
import sceneProvider from "../../../providers/sceneProvider";

class CartActions extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    addToCart() {
        serverRequester.addToCart(this.props.item);

        eventEmitter.emit(productListProvider.getUpdatedEventName());
    }

    reduceInCart() {
        serverRequester.reduceInCart(this.props.item);

        eventEmitter.emit(productListProvider.getUpdatedEventName());
        if (serverRequester.getInCartTotal() <= 0) {
            this.switchToMenu();
        }
    }

    removeFromCart() {
        serverRequester.removeFromCart(this.props.item);

        eventEmitter.emit(productListProvider.getUpdatedEventName());
        if (serverRequester.getInCartTotal() <= 0) {
            this.switchToMenu();
        }
    }

    switchToMenu() {
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
            <div className="actions cart-actions">
                <FontAwesomeIcon onClick={this.removeFromCart.bind(this)} icon={faTimes}/>
                <div className="cart-actions-details">
                    <FontAwesomeIcon onClick={this.reduceInCart.bind(this)} icon={faMinus}/>
                    <div>{this.props.item.inCart}</div>
                    <FontAwesomeIcon onClick={this.addToCart.bind(this)} icon={faPlus}/>
                </div>
            </div>
        );
    }
}

export default CartActions;
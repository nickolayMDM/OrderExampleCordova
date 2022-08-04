import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import eventEmitter from "../../adapters/eventAdapter";
import serverRequester from "../../adapters/serverRequesterAdapter";
import productListProvider from "../../providers/productListProvider";
import modalProvider from "../../providers/modalProvider";

import Button from "../commons/Button";

import "../../styles/ControlMenu/ConfirmOrder.scss";

class ConfirmOrder extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        productListProvider.addProviderListener(this);

        this.state = {
            displayed: false
        };

        this.containerRef = React.createRef();

        eventEmitter.addListener("showControlPopup", (name) => {
            if (name === "cart") {
                this.setState({
                    displayed: true
                });
            } else {
                if (this.state.displayed === true) {
                    this.setState({
                        displayed: false
                    });
                }
            }
        });
    }

    clearCart() {
        serverRequester.clearCart();

        eventEmitter.emit("switchTab", "menu");
        productListProvider.setTab("menu");
    }

    onConfirm() {
        modalProvider.switchToModal({
            name: "confirmOrder"
        });
    }

    getClassName() {
        let classNameString = "control-menu-popup order-confirm";
        if (!this.state.displayed) {
            classNameString += " hidden";
        }
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    render() {
        return (
            <div ref={this.containerRef} className={this.getClassName()}>
                <div className="cart-total text-right">
                    {translate("Total price: {price} UAH", "General", {price: serverRequester.getInCartTotalPrice()})}
                </div>
                <div className="cart-actions">
                    <Button className="button-grey"
                            onClick={this.clearCart.bind(this)}>{translate("Cancel Order", "Actions")}</Button>
                    <Button onClick={this.onConfirm.bind(this)}>{translate("Confirm Order", "Actions")}</Button>
                </div>
            </div>
        );
    }
}

export default ConfirmOrder;
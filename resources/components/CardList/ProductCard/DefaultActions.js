import React, {Component} from 'react';
import validators from "../../../helpers/validators";
import {applyTranslationUpdates, translate} from "../../../adapters/translatorAdapter";
import serverRequester from "../../../adapters/serverRequesterAdapter";
import eventEmitter from "../../../adapters/eventAdapter"
import productListProvider from "../../../providers/productListProvider";

import Svg from "../../commons/Svg";
import Button from "../../commons/Button";

import AddFavouriteSvg from "../../../images/addfavourite.svg";
import UnfavouriteSvg from "../../../images/unfavourite.svg";

class DefaultActions extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    addToCart() {
        serverRequester.addToCart(this.props.item);

        eventEmitter.emit(productListProvider.getUpdatedEventName());
    }

    addToWishlist() {
        serverRequester.addToWishlist(this.props.item);

        eventEmitter.emit(productListProvider.getUpdatedEventName());
    }

    removeFromWishlist() {
        serverRequester.removeFromWishlist(this.props.item);

        eventEmitter.emit(productListProvider.getUpdatedEventName());
    }

    _renderWishlistAction() {
        if (!validators.isBoolean(this.props.item.inWishlist) || this.props.item.inWishlist === false) {
            return (
                <Button className="button-link button-link-danger wishlist-button"
                        onClick={this.addToWishlist.bind(this)}>
                    <Svg src={AddFavouriteSvg} className="svg-danger" width="24" height="24"/>
                </Button>
            );
        }

        return (
            <Button className="button-link button-link-black wishlist-button"
                    onClick={this.removeFromWishlist.bind(this)}>
                <Svg src={UnfavouriteSvg} width="24" height="24"/>
            </Button>
        );
    }

    render() {
        return (
            <div className="actions">
                <Button className="button-thin" onClick={this.addToCart.bind(this)}>
                    {translate("Add to Cart", "Actions")}
                </Button>
                {this._renderWishlistAction()}
            </div>
        );
    }
}

export default DefaultActions;
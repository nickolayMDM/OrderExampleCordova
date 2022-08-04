import React, {Component} from 'react';
import validators from "../../helpers/validators";
import {applyTranslationUpdates, translate, translateList} from "../../adapters/translatorAdapter";
import serverRequester from "../../adapters/serverRequesterAdapter";
import eventEmitter from "../../adapters/eventAdapter";
import productListProvider from "../../providers/productListProvider";

import Svg from "../commons/Svg";

import PlaceholderImageSvg from "../../images/CardList/product_placeholder.svg";
import FavouriteSvg from "../../images/favourite.svg";
import CartSvg from "../../images/cart.svg";
import DefaultActions from "./ProductCard/DefaultActions";
import CartActions from "./ProductCard/CartActions";

import "../../styles/CardList/ProductCard.scss";

import pizza4seasons from "../../images/products/pizza/4seasons.png";
import pizzaDragon from "../../images/products/pizza/dragon.png";
import pizzaFamily from "../../images/products/pizza/family.png";
import pizzaMargarita from "../../images/products/pizza/margarita.png";
import pizzaVegetarian from "../../images/products/pizza/vegetarian.png";
import wokChicken from "../../images/products/wok/chicken.png";
import wokPork from "../../images/products/wok/pork.png";
import wokVeal from "../../images/products/wok/veal.png";
import wokVegetables from "../../images/products/wok/vegetables.png";

const images = {
    pizza4seasons,
    pizzaDragon,
    pizzaFamily,
    pizzaMargarita,
    pizzaVegetarian,
    wokChicken,
    wokPork,
    wokVeal,
    wokVegetables
};

class ProductCard extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    getClassName() {
        let className = "card product-card";

        return className;
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

    _renderProductImage() {
        if (!validators.isPopulatedString(this.props.item.imageName) || !validators.isDefined(images[this.props.item.imageName])) {
            return <div className="product-image-container placeholder">
                <Svg src={PlaceholderImageSvg} className="icon-placeholder"/>
                {this._renderProductImageIcons()}
            </div>;
        }

        return <div className="product-image-container">
            <img src={images[this.props.item.imageName]}/>
            {this._renderProductImageIcons()}
        </div>;
    }

    _renderProductImageIcons() {
        let components = [];
        if (this.props.tab !== "wishlist" && this.props.item.inWishlist === true) {
            components.push(<Svg src={FavouriteSvg} className="svg-danger icon-wishlist" width="20" height="20"/>);
        }
        if (this.props.tab !== "cart" && this.props.item.inCart > 0) {
            components.push(<div className="icon-cart">
                <Svg src={CartSvg} className="svg-background" width="12" height="12"/>
                {this.props.item.inCart}
            </div>);
        }

        return components;
    }

    _renderProductInfo() {
        return (
            <div className="details">
                <div className="details-name">{translateList(this.props.item.name)}</div>
                <div className="details-price">{this.props.item.price} {translate("UAH", "General")}</div>
                <div className="details-description">{translateList(this.props.item.description)}</div>
            </div>
        );
    }

    _renderActions() {
        if (this.props.tab === "cart") {
            return <CartActions item={this.props.item}/>
        }

        return <DefaultActions item={this.props.item}/>;
    }

    render() {
        return (
            <div className={this.getClassName()}>
                {this._renderProductImage()}
                {this._renderProductInfo()}
                {this._renderActions()}
            </div>
        );
    }
}

export default ProductCard;
import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import eventEmitter from "../../adapters/eventAdapter";
import productListProvider from "../../providers/productListProvider";
import sceneProvider from "../../providers/sceneProvider";

import Svg from "../commons/Svg";

import searchImage from "../../images/search.svg";

class SearchButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    showSearchBar() {
        sceneProvider.switchToScene({
            name: "productList"
        });
        productListProvider.setCategoryID(null, {shouldUpdate: false});
        productListProvider.setTab("search");
        eventEmitter.emit("switchTab", "search");
    }

    render() {
        return (
            <div className="search-button" onClick={this.showSearchBar}>
                <Svg src={searchImage} width="23" height="23" />
                <p className="description-text">{translate("Search", "Actions")}</p>
            </div>
        );
    }
}

export default SearchButton;
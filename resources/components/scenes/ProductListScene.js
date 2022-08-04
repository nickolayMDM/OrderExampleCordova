import React, {Component} from 'react';
import eventEmitter from "../../adapters/eventAdapter"
import serverRequester from "../../adapters/serverRequesterAdapter";
import productListProvider from '../../providers/productListProvider';
import sideMenuProvider from '../../providers/sideMenuProvider';
import sceneProvider from "../../providers/sceneProvider";

import Scene from "../commons/Scene";
import ProductCard from "../CardList/ProductCard";
import LoadingBlock from "../commons/LoadingBlock";

const sceneName = "productList";

class ProductListScene extends Component {
    constructor(props) {
        super(props);

        eventEmitter.addListener(sceneProvider.getEventName(), () => {
            this.toggleCategoriesSideMenu();
        });
        eventEmitter.addListener(productListProvider.getUpdatedEventName(), async () => {
            await this._getContents();
            this.forceUpdate();
        });
        eventEmitter.addListener("switchTab", (tab) => {
            this.setState({
                tab
            });

            this.toggleCategoriesSideMenu(tab);
        });

        this.state = {
            tab: "menu",
            isLoading: false,
            productsList: [],
            showWishlistIcons: true
        };
    }

    toggleCategoriesSideMenu(tab) {
        if (tab === "menu") {
            sideMenuProvider.show({
                name: "categories"
            });
        } else {
            sideMenuProvider.hide({
                name: "categories"
            });
        }
    }

    async _getContents() {
        const page = productListProvider.getPage();
        const limit = productListProvider.getLimit();
        const searchQuery = productListProvider.getSearchQuery();
        const categoryID = productListProvider.getCategoryID();
        const tab = productListProvider.getTab();

        productListProvider.setIsUpdating(true);
        this.setState({
            isLoading: true
        });
        const productList = await serverRequester.getProductsPage({
            page,
            limit,
            searchQuery,
            categoryID,
            tab
        });

        this.setState({
            productList,
            isLoading: false
        });
        productListProvider.setIsUpdating(false);
    }

    _renderProducts() {
        if (typeof this.state.productList === "undefined" || this.state.productList.length < 1) {
            return [];
        }

        return this.state.productList.map((item, index) => {
            return <ProductCard key={index} item={item} tab={this.state.tab}/>;
        });
    }

    async componentDidMount() {
        await this._getContents();
    }

    render() {
        return (
            <Scene name={sceneName} options={{activate: this.props.activate}} className="card-list">
                <LoadingBlock isLoading={this.state.isLoading}/>
                {this._renderProducts()}
            </Scene>
        );
    }
}

export default ProductListScene;
import React, {Component} from 'react';
import validators from "../../helpers/validators";
import serverRequester from "../../adapters/serverRequesterAdapter";
import productListProvider from "../../providers/productListProvider";
import {applyTranslationUpdates, translate, translateList} from "../../adapters/translatorAdapter";
import sideMenuProvider from "../../providers/sideMenuProvider";

import "../../styles/sideMenus/Categories.scss";

import SideMenu from "../commons/SideMenu";
import Button from "../commons/Button";
import SideMenuIconTab from "../commons/SideMenu/SideMenuIconTab";
import SideMenuHeader from "../commons/SideMenu/SideMenuHeader";

const menuName = "categories";

class CategoriesSideMenu extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        productListProvider.addProviderListener(this);

        this.state = {
            list: []
        };
    }

    componentDidMount() {
        const categories = serverRequester.getCategories();

        this.setState({
            list: categories
        });
    }

    setProductListCategory(value) {
        productListProvider.setCategoryID(value);
        sideMenuProvider.close({
            name: menuName
        });
    }

    getButtonClassName(ID) {
        let result = "button-link";

        const currentCategoryID = productListProvider.getCategoryID();
        if (currentCategoryID === ID) {
            result += " active";
        }

        return result;
    }

    _renderList() {
        if (!validators.isPopulatedArray(this.state.list)) {
            return "";
        }

        let components = [];
        let iterator = 0;
        for (let key in this.state.list) {
            if (!this.state.list.hasOwnProperty(key)) continue;

            components.push(<Button key={iterator} className={this.getButtonClassName(this.state.list[key].ID)}
                                    onClick={this.setProductListCategory.bind(this, this.state.list[key].ID)}>
                {translateList(this.state.list[key].name)}
            </Button>);
            iterator++;
        }

        return components;
    }

    render() {
        return (
            <SideMenu name={menuName} className={this.props.className}>
                <SideMenuIconTab/>
                <SideMenuHeader text={translate("Categories", "General")}/>
                <div className="categories-list">
                    <Button className={this.getButtonClassName(null)}
                            onClick={this.setProductListCategory.bind(this, null)}>
                        {translate("All", "General")}
                    </Button>
                    {this._renderList()}
                </div>
            </SideMenu>
        );
    }
}

export default CategoriesSideMenu;
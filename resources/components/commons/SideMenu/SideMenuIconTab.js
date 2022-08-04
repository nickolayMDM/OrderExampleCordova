import React, {Component} from 'react';

import Svg from "../Svg";

import CategoriesSvg from "../../../images/categories.svg";

class SideMenuIconTab extends Component {
    render() {
        return (
            <div className="side-menu-icon-tab">
                <Svg src={CategoriesSvg} width="25" height="25"/>
            </div>
        );
    }
}

export default SideMenuIconTab;
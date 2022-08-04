import React, {Component} from 'react';

class SideMenuHeader extends Component {
    render() {
        return (
            <h1 className="side-menu-header">
                {this.props.text}
            </h1>
        );
    }
}

export default SideMenuHeader;
import React, {Component} from 'react';
import sideMenuProvider from "../../providers/sideMenuProvider";
import validators from "../../helpers/validators";

import "../../styles/commons/SideMenu.scss";

const minStateChangeOffsetPercent = 9;

class SideMenu extends Component {
    constructor(props) {
        super(props);

        sideMenuProvider.addProviderListener(this);
        sideMenuProvider.defineMenu(this.props.name, this.props.options);

        this.state = {
            componentStartPositionX: null,
            touchStartX: null,
            offsetX: 0,
            isMoving: false,
            isOpened: false,
            isShowed: false,
            isMovingLeft: false,
            isTransitioning: true
        };

        this.ref = React.createRef();
    }

    componentDidUpdate(prevProps) {
        let newState = {};

        if (sideMenuProvider.getCurrentlyOpenMenuName() === this.props.name && this.state.isOpened === false) {
            newState.isOpened = true;
        } else if (sideMenuProvider.getCurrentlyOpenMenuName() !== this.props.name && this.state.isOpened === true) {
            newState.isOpened = false;
        }

        if (sideMenuProvider.isMenuDisplayed(this.props.name) && this.state.isShowed === false) {
            newState.isShowed = true;
        } else if (!sideMenuProvider.isMenuDisplayed(this.props.name) && this.state.isShowed === true) {
            newState.isShowed = false;
        }

        if (validators.isPopulatedObject(newState)) {
            this.setState(newState);
        }
    }

    handleClick() {
        if (sideMenuProvider.getCurrentlyOpenMenuName() !== this.props.name && !this.state.isOpened) {
            sideMenuProvider.open({
                name: this.props.name
            });
        }
    }

    handleTouchStart(event) {
        const componentLeftPx = this.ref.current.getBoundingClientRect().left;
        const componentLeftPercent = 100 / window.innerWidth * componentLeftPx;

        this.setState({
            componentStartPositionX: componentLeftPercent,
            touchStartX: event.touches[0].clientX,
            isTransitioning: false
        });
    }

    handleTouchMove(event) {
        const offsetX = 100 / window.innerWidth * (event.touches[0].clientX - this.state.touchStartX);
        let newState = {
            offsetX,
            isMovingLeft: false
        };
        if (this.state.isMoving === false && Math.abs(newState.offsetX) > 1) {
            newState.isMoving = true;
        }
        if (offsetX < 0) {
            newState.isMovingLeft = true;
        }

        this.setState(newState);
    }

    handleTouchEnd() {
        if (this.state.isMoving === true && Math.abs(this.state.offsetX) > minStateChangeOffsetPercent) {
            if (
                (this.isRightSideMenu() && this.state.isMovingLeft)
                || (!this.isRightSideMenu() && !this.state.isMovingLeft)
            ) {
                sideMenuProvider.open({
                    name: this.props.name
                })
            } else {
                sideMenuProvider.close({
                    name: this.props.name
                })
            }
        }

        this.setState({
            offsetX: 0,
            touchX: null,
            isMoving: false,
            isTransitioning: true,
            componentStartPositionX: null,
            touchStartX: null
        });
    }

    isRightSideMenu() {
        return (validators.isPopulatedObject(this.props.options) && this.props.options.rightSide === true);
    }

    getClassName() {
        let classNameString = "side-menu side-menu-" + this.props.name;
        if (this.isRightSideMenu()) {
            classNameString += " side-menu-right"
        } else {
            classNameString += " side-menu-left";
        }

        if (this.state.isTransitioning) {
            classNameString += " transitioning";
        }

        if (this.state.isOpened) {
            classNameString += " opened";
        } else if (this.state.isShowed) {
            classNameString += " showed";
        }

        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    getStyle() {
        if (!this.state.isMoving) {
            return {};
        }

        let left = this.state.componentStartPositionX + this.state.offsetX;

        if (this.isRightSideMenu()) {
            return {left: Math.max(20, Math.min(left, 103)) + "%"};
        }

        return {left: Math.max(-83, Math.min(left, 0)) + "%"};
    }

    render() {
        return (
            <div ref={this.ref} style={this.getStyle()} className={this.getClassName()} onClick={this.handleClick.bind(this)}
                 onTouchStart={this.handleTouchStart.bind(this)} onTouchMove={this.handleTouchMove.bind(this)}
                 onTouchEnd={this.handleTouchEnd.bind(this)}>
                {this.props.children}
            </div>
        );
    }
}

export default SideMenu;
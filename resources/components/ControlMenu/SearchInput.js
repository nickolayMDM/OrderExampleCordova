import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import productListProvider from "../../providers/productListProvider";
import eventEmitter from "../../adapters/eventAdapter";

import TextInput from "../commons/Input/TextInput";

import "../../styles/ControlMenu/SearchInput.scss";

const performSearchDelayMS = 500;

class SearchInput extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        this.clearState = {
            searchQuery: "",
            active: false
        };
        this.state = {
            ...this.clearState,
            displayed: false
        };

        this.containerRef = React.createRef();
        this.performSearchTimeoutID = 0;

        eventEmitter.addListener("showControlPopup", (name) => {
            if (name === "search") {
                this.setState({
                    displayed: true
                });
                this.clearInput();
            } else {
                if (this.state.displayed === true) {
                    this.setState({
                        displayed: false
                    });
                }
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.active) {
            clearTimeout(this.performSearchTimeoutID);
            this.performSearchTimeoutID = setTimeout(this.performSearch.bind(this), performSearchDelayMS);
        } else {
            productListProvider.setSearchQuery("", {shouldUpdate: false});
        }
    }

    clearInput() {
        this.setState({
            searchQuery: ""
        });
    }

    setClearState() {
        this.setState(this.clearState);
    }

    handleSearchTextChange(event) {
        if (!this.state.active) {
            return;
        }

        this.setState({
            searchQuery: event.target.value
        });
    }

    performSearch() {
        productListProvider.setSearchQuery(this.state.searchQuery);
    }

    activateSearchInput() {
        this.setState({
            active: true
        });
    }

    disableSearchInput() {
        this.setState({
            active: false
        });
    }

    getClassName() {
        let classNameString = "control-menu-popup search-input";
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
                <TextInput onChange={this.handleSearchTextChange.bind(this)}
                           onFocus={this.activateSearchInput.bind(this)}
                           onBlur={this.disableSearchInput.bind(this)}
                           value={this.state.searchQuery}
                           placeholder={translate("Your query here...", "Form")}
                           name="searchInput"
                           autoComplete="off"/>
            </div>
        );
    }
}

export default SearchInput;
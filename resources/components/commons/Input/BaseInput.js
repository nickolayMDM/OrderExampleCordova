import React, {Component} from 'react';
import validators from "../../../helpers/validators";
import stringHelpers from "../../../helpers/strings";

import PopupTitle from "../PopupTitle";

import "../../../styles/commons/Input.scss";

class BaseInput extends Component {
    constructor(props) {
        super(props);

        this.clearState = {
            value: "",
            hasError: false,
            customErrorMessage: ""
        };
        this.state = {
            id: undefined,
            ...this.clearState
        };
        this.inputRef = React.createRef();

        this.customErrorMessageTimeout = 0;
    }

    componentDidMount() {
        this.setID();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.id !== prevProps.id
            || this.props.label !== prevProps.label
        ) {
            this.setID();
        }
    }

    setID() {
        if (this.props.id) {
            return this.setState({
                id: this.props.id
            });
        }

        if (!this.props.id && this.props.label) {
            return this.setState({
                id: stringHelpers.getMd5(this.props.label)
            });
        }

        return this.setState({
            id: undefined
        });
    }

    clearInput() {
        this.setState({
            ...this.clearState
        })
    }

    handleChange(event) {
        this.setValue(event.target.value);
    }

    isValid(value) {
        if (validators.isRegExp(this.props.validator)) {
            return this.props.validator.test(value);
        }
        if (validators.isFunction(this.props.validator)) {
            return this.props.validator(value);
        }

        return true;
    }

    validate() {
        const isValid = this.isValid(this.state.value);
        let state = {
            hasError: !isValid
        };

        this.setState(state);
        return isValid;
    }

    getClassName() {
        let classNameString = "input";
        if (this.state.hasError) {
            classNameString += " input-error";
        }
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    onFocus() {
        if (validators.isFunction(this.props.onFocus)) {
            this.props.onFocus();
        }

        if (this.state.hasError) {
            this.setState({
                hasError: false
            });
            this.customErrorMessageTimeout = setTimeout(() => {
                this.setState({
                    customErrorMessage: ""
                });
            }, 300);
        }
    }

    setValue(value) {
        if (validators.isFunction(this.props.before_set)) {
            value = this.props.before_set(value);
        }

        let state = {
            value: value
        };

        this.setState(state);
    }

    getInputProps() {
        return {
            ...this.props,
            validator: undefined,
            invalid_title: undefined
        };
    }

    _renderErrorPopup() {
        if (validators.isPopulatedString(this.state.customErrorMessage)) {
            return (
                <PopupTitle display={this.state.hasError}>
                    {this.state.customErrorMessage}
                </PopupTitle>
            );
        }

        if (validators.isPopulatedString(this.props.invalid_title)) {
            return (
                <PopupTitle display={this.state.hasError}>
                    {this.props.invalid_title}
                </PopupTitle>
            );
        }

        return "";
    }

    showCustomError(message) {
        clearTimeout(this.customErrorMessageTimeout);
        this.setState({
            customErrorMessage: message,
            hasError: true
        });
    }

    _renderLabel() {
        if (!validators.isPopulatedString(this.props.label)) {
            return "";
        }

        return <label htmlFor={this.state.id}>{this.props.label}</label>
    }

    render() {
        return (
            <div className="input-wrapper">
                {this._renderLabel()}
                <input id={this.state.id} ref={this.inputRef} value={this.state.value} onFocus={this.onFocus.bind(this)} onChange={this.handleChange.bind(this)} {...this.getInputProps()} className={this.getClassName()}/>
                {this._renderErrorPopup()}
            </div>
        );
    }
}

export default BaseInput;
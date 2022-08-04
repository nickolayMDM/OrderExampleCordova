import React, {Component} from 'react';
import validators from "../../helpers/validators";
import stringHelpers from "../../helpers/strings";

class DropdownSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: undefined
        };
    }

    getClassName() {
        let classNameString = "input dropdown-select";
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
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

    getWrapperClassName() {
        let classNameString = "input-wrapper select-wrapper";
        if (typeof this.props.className === "string") {
            classNameString += " " + this.props.className;
        }

        return classNameString;
    }

    render() {
        if (validators.isPopulatedString(this.props.label)) {
            return (
                <div className={this.getWrapperClassName()}>
                    <label htmlFor={this.state.id}>{this.props.label}</label>
                    <select {...this.props} className="input dropdown-select" />
                </div>
            );
        }

        return (
            <select {...this.props} className={this.getClassName()} />
        );
    }
}

export default DropdownSelect;
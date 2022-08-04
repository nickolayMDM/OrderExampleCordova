import React, {Component} from 'react';
import translatorAdapter from "../../../adapters/translatorAdapter";
import accountProvider from "../../../providers/accountProvider";
import validators from "../../../helpers/validators";

import TextInput from "../../commons/Input/TextInput";
import TextArea from "../../commons/TextArea";
import Form from "../../commons/Form";
import Button from "../../commons/Button"

const transitionTimeMS = 1000;

class SettingsSceneAccountForm extends Component {
    constructor(props) {
        super(props);

        translatorAdapter.applyTranslationUpdates(this);

        this.state = {
            isUserDataSaving: false,
            saveButtonFadeClassName: ""
        };

        this.fullnameInputRef = React.createRef();
        this.phoneInputRef = React.createRef();
        this.addressInputRef = React.createRef();
    }

    onOrderEndpointDataSubmit() {
        if (this.state.isUserDataSaving) {
            return;
        }

        accountProvider.setFullname(this.fullnameInputRef.current.baseRef.current.state.value);
        accountProvider.setPhone(this.phoneInputRef.current.baseRef.current.state.value);
        accountProvider.setAddress(this.addressInputRef.current.state.value);

        this.setState({
            isUserDataSaving: true,
            saveButtonFadeClassName: "button-success"
        });

        setTimeout(() => {
            this.setState({
                saveButtonFadeClassName: "transition-all-slow"
            });
        }, 500);
        setTimeout(() => {
            this.setState({
                isUserDataSaving: false,
                saveButtonFadeClassName: ""
            });
        }, transitionTimeMS)
    }

    getSaveButtonClassName() {
        let className = "save-button form-margin";

        if (validators.isPopulatedString(this.state.saveButtonFadeClassName)) {
            className += " " + this.state.saveButtonFadeClassName;
        }

        return className;
    }

    getSaveButtonText() {
        if (this.state.isUserDataSaving) {
            return translatorAdapter.translate("Saved", "Actions");
        }

        return translatorAdapter.translate("Save", "Actions");
    }

    render() {
        return (
            <Form onSubmit={this.onOrderEndpointDataSubmit.bind(this)}>
                <TextInput ref={this.fullnameInputRef} label={translatorAdapter.translate("Full name", "General")}/>
                <TextInput ref={this.phoneInputRef} label={translatorAdapter.translate("Phone", "General")}/>
                <TextArea ref={this.addressInputRef} rows="4"
                          label={translatorAdapter.translate("Address", "General")}/>
                <div className="text-right">
                    <Button className={this.getSaveButtonClassName()}
                            onClick={this.onOrderEndpointDataSubmit.bind(this)}>{this.getSaveButtonText()}</Button>
                </div>
            </Form>
        );
    }
}

export default SettingsSceneAccountForm;
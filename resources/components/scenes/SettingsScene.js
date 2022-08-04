import React, {Component} from 'react';
import translatorAdapter from "../../adapters/translatorAdapter";
import colorModeProvider from "../../providers/colorModeProvider";
import accountProvider from "../../providers/accountProvider";

import Scene from "../commons/Scene";
import DropdownSelect from "../commons/DropdownSelect";
import AccountForm from "./SettingsScene/AccountForm";

import "../../styles/scenes/SettingsScene.scss";

const sceneName = "settings";

class SettingsScene extends Component {
    constructor(props) {
        super(props);

        translatorAdapter.applyTranslationUpdates(this);
        colorModeProvider.applyTranslationUpdates(this);

        this.state = {
            isUserDataSaving: false,
            language: translatorAdapter.getCurrentLocale()
        };

        this.fullnameInputRef = React.createRef();
        this.addressInputRef = React.createRef();
    }

    getLanguageSelectOptions() {
        const locales = translatorAdapter.getAvailableLocales();
        let options = [];
        let iterator = 0;

        for (let key in locales) {
            options.push(<option key={iterator} value={key}>{locales[key].label}</option>);
            iterator++;
        }

        return options;
    }

    getColorModeOptions() {
        const locales = colorModeProvider.getColorModes();
        let options = [];
        let iterator = 0;

        for (let key in locales) {
            options.push(<option key={iterator} value={key}>{locales[key].label}</option>);
            iterator++;
        }

        return options;
    }

    async handleLanguageOptionChange(event) {
        this.setState({
            language: event.target.value
        });
        await translatorAdapter.setLocale({
            localeCode: event.target.value
        });
    }

    async handleColorModeChange(event) {
        await colorModeProvider.switchTo({
            name: event.target.value
        });
    }

    onOrderEndpointDataSubmit() {
        accountProvider.setFullname(this.fullnameInputRef.current.baseRef.current.state.value);
        accountProvider.setAddress(this.addressInputRef.current.state.value);

        this.setState({
            isUserDataSaving: true
        });
    }

    render() {
        return (
            <Scene name={sceneName} options={{activate: this.props.activate}}>
                <DropdownSelect label={translatorAdapter.translate("Language", "General")} value={this.state.language}
                                onChange={this.handleLanguageOptionChange.bind(this)}>
                    {this.getLanguageSelectOptions()}
                </DropdownSelect>
                <DropdownSelect className="form-margin" label={translatorAdapter.translate("Color Scheme", "General")}
                                onChange={this.handleColorModeChange.bind(this)}>
                    {this.getColorModeOptions()}
                </DropdownSelect>
                <hr/>
                <AccountForm/>
            </Scene>
        );
    }
}

export default SettingsScene;
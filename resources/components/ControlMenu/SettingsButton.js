import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import sceneProvider from "../../providers/sceneProvider";
import modalProvider from "../../providers/modalProvider";
import accountProvider from "../../providers/accountProvider";
import validators from "../../helpers/validators";

import Svg from "../commons/Svg";

import settingsImage from "../../images/settings.svg";

class SettingsButton extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
        accountProvider.applyAccountUpdates(this);
    }

    openSettingsScene() {
        return sceneProvider.switchToScene({
            name: "settings"
        });
    }

    render() {
        return (
            <div className="settings-button" onClick={this.openSettingsScene.bind(this)}>
                <Svg src={settingsImage} width="22" height="22" />
                <p className="description-text">{translate("Settings", "General")}</p>
            </div>
        );
    }
}

export default SettingsButton;
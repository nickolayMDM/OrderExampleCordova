import React, {Component} from 'react';
import {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import modalProvider from "../../providers/modalProvider";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import Button from "../commons/Button";

import "../../styles/modals/OrderThankYouModal.scss";

const modalName = "orderThankYou";

class OrderThankYouModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);
    }

    async onClose() {
        modalProvider.hideModal();
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Order Confirmed", "Dialog")}/>
                <ModalBody>
                    <p>{translate("Thank you for your order!", "Texts")}</p>
                    <p>{translate("We will contact you as soon as possible.", "Texts")}</p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.onClose.bind(this)}>{translate("Close", "Actions")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default OrderThankYouModal;
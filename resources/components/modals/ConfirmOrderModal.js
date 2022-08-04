import React, {Component} from 'react';
import serverRequester from "../../adapters/serverRequesterAdapter";
import accountProvider from "../../providers/accountProvider";
import translatorAdapter, {applyTranslationUpdates, translate} from "../../adapters/translatorAdapter";
import modalProvider from "../../providers/modalProvider";
import productListProvider from "../../providers/productListProvider";
import eventEmitter from "../../adapters/eventAdapter";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import TextInput from "../commons/Input/TextInput";
import Form from "../commons/Form";
import TextArea from "../commons/TextArea";

const modalName = "confirmOrder";

class ConfirmOrderModal extends Component {
    constructor(props) {
        super(props);

        applyTranslationUpdates(this);

        this.form = {
            fullname: {
                ref: React.createRef()
            },
            phone: {
                ref: React.createRef()
            },
            address: {
                ref: React.createRef()
            }
        };
    }

    initializeForm() {
        this.form.fullname.ref.current.baseRef.current.setValue(accountProvider.getFullname());
        this.form.phone.ref.current.baseRef.current.setValue(accountProvider.getPhone());
        this.form.address.ref.current.setValue(accountProvider.getAddress());
    }

    handleFormSubmit() {
        serverRequester.clearCart();
        eventEmitter.emit(productListProvider.getUpdatedEventName());

        modalProvider.switchToModal({
            name: "orderThankYou"
        });

        eventEmitter.emit("switchTab", "menu");
        productListProvider.setTab("menu");
    }

    isFormValid() {
        return this.form.fullname.ref.current.baseRef.current.validate()
        && this.form.phone.ref.current.baseRef.current.validate()
        && this.form.address.ref.current.validate();
    }

    render() {
        return (
            <Modal name={modalName} className="elevation-vh-15" onOpen={this.initializeForm.bind(this)}>
                <ModalHeader title={translate("Confirm Order", "Actions")}/>
                <Form validator={this.isFormValid.bind(this)} handler={this.handleFormSubmit.bind(this)}>
                    <ModalBody>
                        <TextInput ref={this.form.fullname.ref} label={translatorAdapter.translate("Full name", "General")}/>
                        <TextInput ref={this.form.phone.ref} label={translatorAdapter.translate("Phone", "General")}/>
                        <TextArea ref={this.form.address.ref} rows="4"
                                  label={translatorAdapter.translate("Address", "General")}/>
                    </ModalBody>
                    <ModalFooter>
                        <input type="submit" value={translate("Submit", "Actions")}/>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

export default ConfirmOrderModal;
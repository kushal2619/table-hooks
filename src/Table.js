import React, {useEffect, useReducer} from 'react'
import update from 'immutability-helper';

import Header from './Header';
import ContactBody from './ContactBody';
import Modal from "./Modal";
import CreateContactForm from './CreateContactForm';
import {fetchFromIDB, initIDB, closeIDB} from "./services/IndexedDBServices"
import { UPDATE_CONTACT_LIST, HANDLE_MODAL_DISPLAY } from "./constants";
import "./style/TableStyle.css";

const initState = {
  contactList: [],
  starredContactList: [],
  showModal: false,
  formContactDraft: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    
    case UPDATE_CONTACT_LIST:
      const {contactList} = action.payload
      const starredContactList = contactList.filter(contact => contact.isFavourite)

      const newState = update(state, { 
        contactList: {$set: contactList}, 
        starredContactList: {$set: starredContactList}
      })
      console.log(newState)

      return {...state, contactList: contactList, starredContactList: starredContactList}
  
    case HANDLE_MODAL_DISPLAY:
      const {showModal, formContactDraft = null} = action.payload
      return {...state, showModal: showModal, formContactDraft: formContactDraft}             

    default:
      console.error(`unknown action ${action.type} is found in onAction.`)
      return state
  }
}

function Table() {

    const [state, onAction] = useReducer(reducer, null, () => initState);

    useEffect(() => {

      (async function() {
        try {
          await initIDB()
          console.log("Indexed DB successfully opened");
          const response = await fetchFromIDB("contacts");
          const contactList = response.map(el => el.item);
          console.log(contactList)
          const payload = { contactList: contactList }
          onAction({type: UPDATE_CONTACT_LIST, payload: payload})
        } 
        catch (error) {
          console.log(error.message);
        }
      })()

      return () => {
        closeIDB()
      }
    }, [])
    
    return (
      <>
        <table className="contact-table">
          <Header onAction = {onAction}/>

          {(state.starredContactList.length > 0) && 
            <ContactBody  starredContactList = {state.starredContactList}
                          contactList = {state.contactList}
                          onAction = {onAction}
            />
          }

          <ContactBody  contactList = {state.contactList}
                        onAction = {onAction}
          />
        </table>

        {state.showModal && 
          <Modal onAction = {onAction}>
            <CreateContactForm  contactDraft={state.formContactDraft}
                                contactList = {state.contactList}
                                onAction = {onAction}
            />
          </Modal>
        }
      </>
    )
}

export default Table

//onAction = {onAction}
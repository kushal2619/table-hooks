import React from 'react'

import {updateIDB, deleteInIDB} from "./services/IndexedDBServices"
import { HANDLE_MODAL_DISPLAY, UPDATE_CONTACT_LIST } from "./constants";
import starSVG from "./img/star.svg";
import blueStarSVG from "./img/blueStar.png";
import editSVG from "./img/edit.svg"; 
import binSVG from "./img/bin.svg";
import "./style/ContactBodyStyle.css";

const handleStar = async(event, contactList, onAction) => {
  console.log(contactList);
  const id = event.target.dataset.name.split("-")[1];
  const targetContact = contactList.find(contact => contact.uid === id);
  const updatedContact = {...targetContact, isFavourite: !targetContact.isFavourite};

  try {
    await updateIDB("contacts", updatedContact)
    console.log("update successfully")
    const updatedContactList = contactList.map(contact => ((contact.uid === id)? updatedContact : contact))
    onAction({type: UPDATE_CONTACT_LIST, payload: {contactList: updatedContactList}});
  } 
  catch (error) {
    console.log(error.message);
  }
}

const handleOnEdit = (event, contactList, onAction) => {
  const id = event.target.dataset.name.split("-")[1];
  const contactDraft = contactList.find(contact => contact.uid === id);

  const payload = {
    showModal: true,
    formContactDraft: contactDraft,
  }
  onAction({type: HANDLE_MODAL_DISPLAY, payload: payload});
}

const handleOnDelete = async(event, contactList, onAction) => {
  const id = event.target.dataset.name.split("-")[1]
  const updatedContactList = contactList.filter(contact => contact.uid !== id);

  try {
    await deleteInIDB("contacts", id)
    console.log("delete contact successfully");
    onAction({type: UPDATE_CONTACT_LIST, payload: {contactList: updatedContactList}});
  } 
  catch (error) {
    console.log(error.message);
  }
}

function ContactBody(props) {
  return (
    <tbody>
      <tr>
        <td className="contact-type">
          {props.starredContactList? `Starred Contact (${props.starredContactList.length})`
                                    : `Contact (${props.contactList.length})`}
        </td>
      </tr>
      
      {(props.starredContactList? props.starredContactList: props.contactList).map(contact => {
        return (
          <tr className="table-row" 
              key={contact.uid} 
              id={`row-${contact.uid}`}
          >
            <td className="name-cell">
                <div className="name-cell-img">
                    {
                      contact.name.first[0] ||
                      contact.name.last[0] ||
                      contact.job.companyName[0] ||
                      contact.phone.number[0] ||
                      contact.email.emailID[0] ||
                      contact.job.title[0] || "?"
                    }
                </div>
                <div>
                    {`${contact.name.first} ${contact.name.last}`}
                </div>
            </td>

            <td className="email-cell"> 
              {contact.email.emailID} 
            </td>

            <td className="phone-cell"> 
              {contact.phone.number} 
            </td>

            <td className="job-cell">
              {
                (contact.job.companyName && contact.job.title) ? `${contact.job.title},${contact.job.companyName}`
                                                                : `${contact.job.title}${contact.job.companyName}`
              }
            </td>

            <td className="option-cell">
              <img  src = {(contact.isFavourite) ? blueStarSVG : starSVG} 
                    alt = "starred"
                    className = "star-img"
                    data-name = {`star-${contact.uid}`}
                    onClick = {(event) => handleStar(event, props.contactList, props.onAction)}
              />
              <img  src = {editSVG} 
                    alt = "" 
                    className = "edit-img"
                    data-name = {`edit-${contact.uid}`}
                    onClick = {(event) => handleOnEdit(event, props.contactList, props.onAction)}
              />
              <img  src = {binSVG}
                    alt = "delete"
                    className = "bin-img"
                    data-name = {`bin-${contact.uid}`}
                    onClick = {(event) => handleOnDelete(event, props.contactList, props.onAction)}
              />
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}

export default ContactBody

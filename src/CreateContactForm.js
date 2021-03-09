import React, {useReducer} from 'react'

import {updateIDB} from "./services/IndexedDBServices"
import personSVG from "./img/person.svg";
import officeSVG from "./img/office.svg";
import mailSVG from "./img/mail.svg";
import phoneSVG from "./img/phone.svg";
import { UPDATE_CONTACT_LIST, HANDLE_MODAL_DISPLAY } from "./constants";
import "./style/CreateContactFormStyle.css"

const HANDLE_CHANGE_INPUT = "HANDLE_CHANGE_INPUT";

const reducer = (state, action) => {
  switch (action.type) {
    case HANDLE_CHANGE_INPUT:
      return {...state, [action.payload.name]: action.payload.value}
  
    default:
      console.error(`unknown ${action.type} found`);
  }
}

function CreateContactForm(props) {

  const initState = {
    firstName: props.contactDraft.name.first,
    lastName: props.contactDraft.name.last,
    companyName: props.contactDraft.job.companyName,
    jobTitle: props.contactDraft.job.title,
    emailID: props.contactDraft.email.emailID,
    phone: props.contactDraft.phone.number,
  }
  
  // function getInitState() {
  //   console.log("!");
  //   return initState
  // }

  // const [state, dispatch] = useReducer(reducer, getInitState());

  const [state, dispatch] = useReducer(reducer, null, () => initState);

  const checkAllInputValues = () => {
    const {firstName, lastName, companyName, jobTitle, emailID, phone} = state;
    return (firstName || lastName || companyName || jobTitle || emailID || phone)
  }

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if(checkAllInputValues()) {
        const id = (props.contactDraft.uid) || (Date.now().toString(36) + Math.random().toString(36).slice(2));
        const isFavourite = props.contactDraft.isFavourite

        const contactDraft = {
            uid: id,
            isFavourite: isFavourite,
            name: {
                first: state.firstName,
                last: state.lastName,
            },
            job: {
                companyName: state.companyName,
                title: state.jobTitle,
            },
            email: {
                emailID: state.emailID,
            },
            phone: {
                number: state.phone,
            }
        }

        let updatedContactList = [];

        if(contactDraft.uid === props.contactDraft.uid) {
            updatedContactList = props.contactList.map( contact => 
              (contact.uid === contactDraft.uid)? contactDraft : contact
            )
        } else {
            updatedContactList = [...props.contactList, contactDraft];
        }

        updateIDB("contacts", contactDraft)
        .then(() => {
            console.log(`successfully updated`);
            props.onAction({type: UPDATE_CONTACT_LIST, payload: {contactList: updatedContactList} });
            props.onAction({type: HANDLE_MODAL_DISPLAY, payload: { showModal: false }});
        })
        .catch(err => {
            console.log(err.message);
        })   
    }
  }

  return (
    <form className="create-contact-form" onSubmit={handleOnSubmit}>
      <div className="form-header">
          <div className="header-text">Create New Contact</div>
      </div>

      <div className="form-body" >
        <div className="input-row">
          <img src={personSVG} alt="" className="input-field-img"/>

          <div className="row-field">
            <div className="row-field-header-text">
                First name
            </div>
            <input type="text" 
                    placeholder="First name" 
                    className="row-field-input"
                    value={state.firstName}
                    onChange={(event) => dispatch(
                      { type: HANDLE_CHANGE_INPUT, 
                        payload:{name: "firstName", value: event.target.value}
                      }
                    )}
                    data-name = "firstName"
            />
          </div>

          <div className="row-field">
            <div className="row-field-header-text">
                Last name
            </div>
            <input type="text" 
                    placeholder="Last name" 
                    className="row-field-input"
                    value={state.lastName}
                    onChange={(event) => dispatch(
                      { type: HANDLE_CHANGE_INPUT, 
                        payload:{name: "lastName", value: event.target.value}
                      }
                    )}
                    data-name = "lastName"
            />
          </div>
        </div>

        <div className="input-row">
          <img src={officeSVG} alt="" className="input-field-img"/>

          <div className="row-field">
            <div className="row-field-header-text">
                Company
            </div>
            <input type="text" 
                    placeholder="Company" 
                    className="row-field-input"
                    value={state.companyName}
                    onChange = {(event) => dispatch(
                      { type: HANDLE_CHANGE_INPUT, 
                        payload:{name: "companyName", value: event.target.value}
                      }
                    )}
                    data-name = "companyName"
            />
          </div>

          <div className="row-field">
            <div className="row-field-header-text">
                Job title
            </div>
            <input type="text" 
                    placeholder="Job title" 
                    className="row-field-input"
                    value={state.jobTitle}
                    onChange = {(event) => dispatch(
                      { type: HANDLE_CHANGE_INPUT, 
                        payload:{name: "jobTitle", value: event.target.value}
                      }
                    )}
                    data-name = "jobTitle"
            />
          </div>
        </div>

        <div className="input-row">
          <img src={mailSVG} alt="" className="input-field-img"/>

          <div className="row-field">
            <div className="row-field-header-text">
                Email
            </div>
            <input type="text" 
                    placeholder="Email" 
                    className="row-field-input"
                    value={state.emailID}
                    onChange = {(event) => dispatch(
                      { type: HANDLE_CHANGE_INPUT, 
                        payload:{name: "emailID", value: event.target.value}
                      }
                    )}
                    data-name = "emailID"
            />
          </div>
        </div>

        <div className="input-row">
          <img src={phoneSVG} alt="" className="input-field-img"/>

          <div className="row-field">
            <div className="row-field-header-text">
                Phone
            </div>
            <input type="text" 
                    placeholder="Phone" 
                    className="row-field-input"
                    value={state.phone}
                    onChange = {(event) => dispatch(
                      { type: HANDLE_CHANGE_INPUT, 
                        payload:{name: "phone", value: event.target.value}
                      }
                    )}
                    data-name = "phone"
            />
          </div>
        </div>
      </div>

      <div className="form-footer">
        <div  className="footer-button" 
              onClick = {() => props.onAction({
                                type: HANDLE_MODAL_DISPLAY, 
                                payload: { showModal: false }
                              })
                        }
        >
            Cancel
        </div>
        <button className={(checkAllInputValues())? "footer-button"
                                                        : "footer-button disabled-save-button"}
                id="create-contact-form-save-button"
                type="submit"
        >
            Save
        </button>
      </div>
    </form>
  )
}

export default CreateContactForm

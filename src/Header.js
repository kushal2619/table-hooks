import React, {useCallback} from 'react'

import addSVG from "./img/add.svg";
import {HANDLE_MODAL_DISPLAY} from "./constants"
import "./style/HeaderStyle.css";


const handleAddContactbutton = (onAction) => {
  
    const payload = {
      showModal: true,
      formContactDraft: {
        isFavourite: false,
        name: {
          first: "",
          last: ""
        },
        job: {
          companyName: "",
          title: ""
        },
        email: {
          emailID: "",
        },
        phone: {
          number: "",
        }
      }
    }
    
    onAction({type: HANDLE_MODAL_DISPLAY, payload: payload});
}

function Header(props) {
  const onAction = props.onAction;

  const memoizedHandleAddContactbutton = useCallback(handleAddContactbutton, [onAction])
  
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone number</th>
        <th>Job title & company</th>
        <th>
          <img  src={addSVG} 
                alt="Add Contact" 
                className="add-button"
                onClick={() => memoizedHandleAddContactbutton(onAction)}
          />
        </th>
      </tr>
    </thead>
  )
}

export default Header

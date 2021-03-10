import React from 'react'

import { HANDLE_MODAL_DISPLAY } from "./constants";
import "./style/ModalStyle.css";

const handleDisplay = (event, onAction) => {
  if(event.target.dataset.name === "modal-background") {
    onAction({type: HANDLE_MODAL_DISPLAY, payload:  { showModal: false }})
  }
}

function Modal(props) {
  
  return (
    <div  className="modal-background" 
            onClick = {(event) => handleDisplay(event, props.onAction)}
            data-name = "modal-background"
      >
        <div className="modal-center">
          {props.children}
        </div>
      </div>
  )
}

export default Modal

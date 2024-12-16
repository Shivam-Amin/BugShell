import React from 'react'
import ReactDom from 'react-dom'
import { IoClose } from "react-icons/io5";
import '../../CSS/models/createPortal.css'


export default function CreateProtal({ open, children, onClose, width, height }) {

  const MODEL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // backgroundColor: '#FFF',
    backgroundColor: '#2a2a2a',
    boxShadow: '0 0 9px 2px rgba(0, 0, 0, 0.1)',
    padding: '40px 50px',
    width: '500px',
    // height: '500px',
    // width: `${width}px`,
    // height: `${height}px`,
    zIndex: 1000
  }
  
  const OVERLAY_STYLES = {
    PointerEvent: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
  }

  if (!open) return null

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} 
        onMouseDown={(e)=>e.preventDefault()} onContextMenu={(e)=>{
          e.preventDefault();
          e.stopPropagation();
        }} />
      <div className='model' style={MODEL_STYLES}>
        {/* <IoClose className="svg" onClickCapture={onClose} /> */}
        {children}
      </div>
    </>,
    document.getElementById('portal')
  )
}
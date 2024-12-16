import React from 'react'
import '../../CSS/ui/ModifiedBtn.css';


const ModifiedBtn = (props) => {

  const { width, type, children, fontSize, marginTop } = props
  
  return (
    <div className='button_container' style={{ width }}>
      <button type={type} style={{ fontSize, marginTop }} >
        {children}
      </button>
    </div>
  )
}

export default ModifiedBtn;
import React, { useContext, useState } from 'react'
import CreateProtal from './CreatePortal'
import ModifiedP from '../ui/ModifiedP'
import { IoClose } from "react-icons/io5";
import ModifiedInput from '../ui/ModifiedInput';
import ModifiedBtn from '../ui/ModifiedBtn';
import { server } from '../../main';
import toast from 'react-hot-toast';
import axios from 'axios';
import { HomeContext } from '../Home';


const CreateFolderModel = ({ setLoading, 
  createFolderOption, 
  setCreateFolderOption, 
  createFolder,
  marginTop }) => {

  const [isOpen, setIsOpen] = useState(createFolderOption)
  const [shellName, setShellName] = useState("")

  return (
    <CreateProtal open={isOpen} width={500} height={200} onClose={() => {
        setIsOpen(false) 
        setCreateFolderOption(false) 
      }} >
        <div className='createFolderModel'>
          <div className="title">
            <ModifiedP span_text="$ ./" text="Shell Name" />
            <IoClose className="svg" onClickCapture={() => {
              setIsOpen(false) 
              setCreateFolderOption(false) 
            }} />
          </div>

          <div className="main">
            <form onSubmit={(e) => createFolder(e, shellName)}>
              <ModifiedInput 
                span_text="$ "
                type="text"
                name="shellName"
                value={shellName}
                onChange={(e) => setShellName(e.target.value)}
                className={shellName.trim() !== '' ? 'filled' : 'not-filled'}
                placeholder="Enter Shell Name..."
                autoFocus={true} />
              
              <ModifiedBtn>
                <p>Create</p>
              </ModifiedBtn>
            </form>
          </div>
        </div>
    </CreateProtal>
  )
}

export default CreateFolderModel
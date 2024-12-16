import React, { createContext, Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Context, server } from '../main';
import axios from 'axios';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import io from 'socket.io-client';
import {Xterm} from "./xterm/Xterm"

import default_user_logo from '../assets/default_user_logo.jpg';
import '../CSS/home.css';
// import './../CSS/xterm.css';
import 'xterm/css/xterm.css'
import ModifiedP from './ui/ModifiedP';
import toast from 'react-hot-toast';
import Loading from './Loading';
import ContextMenu from './ContextMenu';
import CreateFolderModel from './Models/CreateFolderModel';
import ModifiedBtn from './ui/ModifiedBtn';
import { Link, useLocation } from 'react-router-dom';
import { TiFolderDelete } from "react-icons/ti";

const EndPoint = "http://localhost:5000";
// var toolsSetupDone = false;

export const HomeContext = createContext({});


const Home = () => {
  const {
    isAuth, setIsAuth, 
    user, setUser, 
    loading, setLoading,
    gitUser, setGitUser,
    contextMenu, setContextMenu } = useContext(Context);
  
  const [homeLoading, setHomeLoading] = useState(false)
  const [shells, setShells] = useState([])
  const [authenticated, setAuthenticated] = useState(false);
  const [createFolderOption, setCreateFolderOption] = useState(false);
  const [toolsSetupDone, setToolsSetupDone] = useState(() => {
    const toolInfo = sessionStorage.getItem('toolSetup');
    return toolInfo === 'true'; // Ensure it's evaluated as a boolean
  })

  // items in context menu
  const contextMenuItems = [
    { title: 'Shell', span_title: '$touch ./' },
    { title: 'Repo', span_title: '$touch ./' },
  ]

  // context Menu width and height
  const cmWidth=175.2;
  // const [cmWidth, setCmWidth] = useState(175);
  const [cmHeight, setCmHeight] = useState(96.8);

  const aiHelp = [
    { command: ":ai", description: "Ask ai anything." },
    { command: ":ai -t <task>", description: "Based on the prompt, generates commands that directly executes in the terminal" },
    { command: ":ai -f <file>", description: "Provide a file path to include its content as context." },
    { command: ":ai -d <dir>", description: "Provide a directory path to include all files as context" },
    { command: ":ai -c", description: "Starts an context-based interactive chat window (type \"exit\" to exit)" },
  ];

  // const terminalRef = useRef(null);
  // const [ws, setWs] = useState(null);

  const setupTools = async () => {

    // const  setupTools = async () => {
      try {
        const {data} = await axios.get(`${server}/shells/check/tools`, {
          withCredentials: true,
          headers: {
            "Content-Type": "applicaiton/json"
          }
        })
        console.log(data);
        sessionStorage.setItem('toolSetup', true);
        setToolsSetupDone(true);

        toast.success(data.message)
      } catch (error) {
        let errorMessage = 'An unexpected error occurred';
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      }

    // }
  }

  useEffect(() => {
    // setToolsSetupDone(false);
    if (!toolsSetupDone && isAuth) {
      console.log('setuping tools...');
      setupTools();
    }
  }, [])


  useEffect( () => {
    // setHomeLoading(true);
    const  getShells = async () => {
      const {data} = await axios.get(`${server}/shells/get/all`, {
        withCredentials: true,
        headers: {
          "Content-Type": "applicaiton/json"
        }
      })
      const sh = data.shells;

      await setShells(sh)
    }
    
    getShells();

  }, [homeLoading]);


  const handleLogoutClick = async () => {
    try {
      const { data } = await axios.get(`${server}/users/logout`, {
        withCredentials: true,
      })
      setIsAuth(false);
      toast.success(data.message);
    } catch(error) {
        let errorMessage = 'An unexpected error occurred';
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the default browser context menu
    let x = e.pageX, y = e.pageY,
    winWidth = window.innerWidth,
    winHeight = window.innerHeight

    x = x > (winWidth - cmWidth) ? (winWidth - cmWidth) : x;
    y = y > (winHeight - cmHeight) ? (winHeight - cmHeight) : y;

    setContextMenu({
      visible: true,
      x: x, y: y,
    });
  };

  const handleSingleClick = () => {
    setContextMenu({
      visible: false,
      x: 0, y: 0,
    });
  };

  const handleItemClick = (title) => {    
    /* handles click on context menu items */
    
    if (title.toLowerCase().includes('shell')) {
      setCreateFolderOption(true)
    } else if (title.toLowerCase().includes('repo')) {
      pass
    }
  }

  const createFolder = async (e, shellName) => {
    e.preventDefault();
    setHomeLoading(true);
    try {
      // parentId = parentId ? parentId : null
      const { data } = await axios.post(`${server}/shells/add`, {
        "name": shellName,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      toast.success(data.message)

      setCreateFolderOption(false)
      // console.log(data);

    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      await setHomeLoading(false);
    }
  }

  const deleteFolder = async (e, shellId, shellName) => {
    e.preventDefault();
    e.stopPropagation();
    
    setHomeLoading(true);
    try {
      // parentId = parentId ? parentId : null
      const { data } = await axios.post(`${server}/shells/delete`, {
        name: shellName,
        id: shellId
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      toast.success(data.message)

      setCreateFolderOption(false)
      // console.log(data);

    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      await setHomeLoading(false);
    }
  }


  if (!isAuth) {
    // return <div>
    //   <p>Loading...</p>
    // </div>
    return <Loading />
  }


  return (
    <HomeContext.Provider 
      value={{
        cmWidth,
        cmHeight, setCmHeight,
        homeLoading, setHomeLoading,
        contextMenuItems,
        handleContextMenu,
        // handleItemClick,
        handleSingleClick,

    }}>
      <div className='home'>
          {/* <div style={{width: '100%', height: '100%'}} >
            <div ref={terminalRef} style={{width: '100%', height: '100%'}} />
          </div> */}
          
          <div className="header">
            <div className="user_info">
              <img className='user_logo' src={default_user_logo} alt="sjdklj" />
              <ModifiedP text={user? user.username : gitUser} />
            </div>


            <div className="menu menu_logout" onClick={handleLogoutClick}>
              <ModifiedP span_text = "$cd /" text = "logout" />
            </div>
          </div>

          <div className="main" onClick={handleSingleClick}>
            { (!toolsSetupDone) ? <Loading>
              <h1>Tools being setup...</h1>
            </Loading>
            : <Fragment>
              <div className="btn_main" 
                onContextMenu={handleContextMenu} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleContextMenu(e)
                }}>

                <ModifiedBtn>
                  <p>+ New</p>
                </ModifiedBtn>

                <ContextMenu
                  x={contextMenu.x}
                  y={contextMenu.y}
                  visible={contextMenu.visible}
                  onItemClick={handleItemClick}
                  isOpen={true}
                />
              </div>

              <div className="title">
                <p className='title_name'> <span>&gt;_ </span>Current Shells</p>

              </div>

              <div className="shells">
                <div className="shells_header">
                  <ModifiedP span_text="Name" />
                  <ModifiedP span_text="Repository" />
                  <ModifiedP span_text="Created" />
                  <ModifiedP />
                </div>

                { (homeLoading) ? <Loading />:
                (shells.length !== 0)
                  ? ( <>
                        { shells.map((shell) => {
                          const createdAtDate = new Date(shell.updatedAt);
                          // Format date and time
                          const formattedDate = createdAtDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          });
                          return (
                            <Fragment key={shell._id}>
                              <Link to={`/shells?folderName=${shell.folder_name}&id=${shell._id}`}>
                                <div className="shell" >
                                    <ModifiedP text={shell.folder_name} span_text="$ ./" />
                                    <ModifiedP span_text={shell.github_username ? github_username : "-"} />
                                    <ModifiedP span_text={formattedDate} />
                                    {/* <TiFolderDelete  className='svg' /> */}
                                    <TiFolderDelete  className='svg' onClick={(e) => deleteFolder(e, shell._id, shell.folder_name)}/>
                                </div>
                              </Link>
                            </Fragment>
                          )
                        })}
                      </>
                    )
                  : shells.length === 0 
                    ? <p style={{width: '100%', marginTop: '20px'}}>Empty!!</p>
                    : <Loading /> 
                  }
              </div>

              {/* <div className="quick_tips">
                <p>Quick Tips:</p>
                <p>• Type <b><i>nvim</i></b> to use neovim.</p>
                {aiHelp.map((item, index) => <React.Fragment key={index}>
                  <p>• <b><i>{item.command}</i></b> - {item.description}</p>
                  </React.Fragment>)}
              </div> */}
            </Fragment>
          }
          </div>

          { createFolderOption &&
            <CreateFolderModel 
              setLoading={setHomeLoading}
              createFolderOption={createFolderOption}
              setCreateFolderOption={setCreateFolderOption}
              createFolder={createFolder} /> }
      </div>
    </HomeContext.Provider>
  )
}

export default Home
import React, { createContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
// import AuthProvider from '../context/AuthProvider.jsx';

// const root = ReactDOM.createRoot(document.getElementById('root'));

const Context = createContext({
  isAuth: false,
  setIsAuth: () => {},
});
const server = 'http://localhost:5000/api/v1'

export { Context, server }

const AppWrapper = ({children}) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [isAuth, setIsAuth] = useState(false)
  const [isRegisted, setIsRegisted] = useState(false)

  const initialAuthUser = localStorage.getItem("cookie");
  const [gitUser, setGitUser] = useState({});

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });

  const ctxValue =  {
    loading: loading,
    setLoading: setLoading,
    user: user,
    setUser: setUser,
    isAuth: isAuth,
    setIsAuth: setIsAuth,
    gitUser: gitUser,
    setGitUser: setGitUser
  }
  // print ctxValue
  
  useEffect(() => {
    axios.get(`${server}/users/me`, {
      withCredentials: true,
    })
    .then((res) => {
      setUser(res.data.user);
      setIsAuth(true)
    })
    .catch((error) => {
      setUser({});
      setIsAuth(false)
      console.log('no token');
      
    })
  }, [])

  return (
    <Context.Provider
      value={{
        loading: loading,
        setLoading: setLoading,
        user: user,
        setUser: setUser,
        isAuth: isAuth,
        setIsAuth: setIsAuth,
        isRegisted: isRegisted,
        setIsRegisted: setIsRegisted,
        gitUser: gitUser,
        setGitUser: setGitUser,
        contextMenu, setContextMenu,
      }}>
        {children}
    </Context.Provider>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AppWrapper>
        <App />
      </AppWrapper>
  </React.StrictMode>,
)
// root.render(
//   // <BrowserRouter>
//       <AppWrapper />
//     // {/* </AuthProvider> */}
//   // </BrowserRouter>
//   // <React.StrictMode>
//   // </React.StrictMode>,
// )

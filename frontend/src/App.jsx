import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import { Context, server } from './main.jsx';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import './App.css'
import axios from 'axios';
import SelectedShell from './components/SelectedShell.jsx';
import Loading from './components/Loading.jsx';

function App() {

  // const {
  //   isAuth, setIsAuth, 
  //   isRegisted, setIsRegisted,
  //   user, setUser, 
  //   gitUser, setGitUser } = useContext(Context);
  const [loading, setLoading] = useState(true)
  // const [authenticated, setAuthenticated] = useState(true);


  useEffect(() => {
    axios.get(`${server}/users/me`, {
      withCredentials: true,
    })
    .then(async (res) => {
      // setUser(res.data.user);
      // setIsAuth(true)
      // setIsRegisted(true)
      setLoading(true)
      // setAuthenticated(true)
      
    })
    .catch((error) => {
      // setUser({});
      // setIsAuth(false)
      // setIsRegisted(false)
      // setAuthenticated(false)
      console.log(error);
      
    }).finally(() => {
      setLoading(false);
    });
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    // <div className='App'>
        <Router>
          <Routes>
            {/* <Route path="/" element={
              isAuth ? <Home /> : <Navigate to='/login' /> } />
            <Route path="/shells" element={
              isAuth ? <SelectedShell /> : <Navigate to='/login' /> } /> */}
            
            <Route path="/" element={<Home />} />
            <Route path="/shells" element={<SelectedShell />} />

            {/* <Route path="/signup" element={
              isAuth ? ( <Navigate to='/' /> ) 
                : (
                isRegisted ? ( <Navigate to='/login' />) 
                  : ( <Register /> )
              )
            } />
            <Route path="/login" element={
              isAuth ? <Navigate to='/' /> : <Login />
            } /> */}
          </Routes>


          <Toaster toastOptions={{
            style: {
              background: '#333',
              color: 'whitesmoke',
              fontSize: '14px',
            }
          }} />
        </Router>
    // </div>
  )
}

export default App

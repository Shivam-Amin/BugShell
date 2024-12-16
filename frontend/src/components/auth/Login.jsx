import React, { useContext, useEffect, useState } from 'react'
import { FaArrowRight } from "react-icons/fa6";
import githubLogo from '../../assets/github-logo.png';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Context, server } from '../../main.jsx';
import '../../CSS/auth.css'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ModifiedP from '../ui/ModifiedP.jsx';
import ModifiedInput from '../ui/ModifiedInput.jsx';
import ModifiedBtn from '../ui/ModifiedBtn.jsx';

const Login = () => {
  const navigate = useNavigate();

  // check App.jsx
  // const location = useLocation();
  // const from = location.state?.from?.pathname || '/';

  const { user, setUser, isAuth, setIsAuth, authUser, setAuthUser } = useContext(Context);
  const [loading, setLoading] = useState(false)

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  // useEffect(() => {
  //   console.log("isAuth changed:", isAuth);
  //   navigate(from)
  // }, [isAuth]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true);

    // const email = inputs.email
    // const password = inputs.password  
    const { email, password } = inputs

    if(!email || !password){
      setErrorMsg("Fill all fields");
      return;
    }
    
    // Regular expression pattern for a valid email address
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the pattern
    if (!emailPattern.test(email)) {
      toast.error("Type a correct email address...");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${server}/users/login`, {
        email,
        password
      }, {
        headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      console.log(data);
      
      toast.success(data.message)
      // setErrorMsg("");
      setIsAuth(true)
      
      // navigate('/')
      
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
      // setErrorMsg(error.response.data.message);
      setIsAuth(false)
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>
      loading...
    </div>
  }

  return (
    <div className='container'>
      <div className="sub_container">
        <form onSubmit={handleSubmit}>
          <h1>
            <p><span>&gt;_</span> Login</p>
          </h1>

          <ModifiedInput
            span_text="$"
            type="text"
            name="email"
            value={inputs.email}
            onChange={handleInputChange}
            className={inputs.email.trim() !== '' ? 'filled' : 'not-filled'}
            placeholder="email" />

          <ModifiedInput
            span_text="$"
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleInputChange}
            className={inputs.password.trim() !== '' ? 'filled' : 'not-filled'}
            placeholder="password" />

          <div className="auth_change_container" >
            <Link to={'/signup'}>
            <ModifiedP span_text = "$cd /" text = "Signup" />
            </Link>
          </div>

          <div className="btn_container">
            {/* <button type="submit">
              <p>Login</p>
              <FaArrowRight className='svg'/>
            </button> */}
            <ModifiedBtn fontSize='1rem'>
              <p>Login</p>
              <FaArrowRight className='svg'/>
            </ModifiedBtn>
          </div>

        </form>
        <div className="seperate_container">
          <ModifiedP span_text = "$cd /" text = "or" />
        </div>
        
        <div className="btn_containe__github">
          <ModifiedBtn width="100%" fontSize='1rem'>
            <p>Login with</p>
            <img src={githubLogo} alt="github logo" />
            <FaArrowRight className='svg'/>
          </ModifiedBtn>
        </div>
      </div>
    </div>
  )
}

export default Login
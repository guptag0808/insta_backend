import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { useState,useContext} from 'react'
import {UserContext} from "../../App"
import M from 'materialize-css'
function Login() {
  const [email,setEmail] =useState("")
  const [password,setPassword] =useState("")
  const {state,dispatch} =useContext(UserContext)
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate('/');
  };
  const postFun=()=>{
    
    fetch("https://backend-insta-deploy.onrender.com/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
       
    })
    .then((res)=>res.json())
    .then((data)=>{
       if(data.error){
        M.toast({html: data.error ,classes:'#b71c1c red darken-4'})
       }else{
        M.toast({html: data.msg , classes:'#00bfa5 teal accent-4'})
        dispatch({type:"USER",payload:data.user})
         localStorage.setItem('Token',data.Token)
         localStorage.setItem('user',JSON.stringify(data.user))
          navigateToHome()
       }
    })
    .catch(err=>{
       console.log(err.message)
    })
  }
  return (
	<div className='myCard'>
     <div className="card login-card" >
        <h1>FotoFlick</h1>
        <input type="text"  placeholder='Enter Your Email'
         value={email} 
         onChange={(e)=>setEmail(e.target.value) }/>
        <input type="password" placeholder='Enter Your Password'  
         value={password} 
         onChange={(e)=>setPassword(e.target.value)}/>
        <button className="btn waves-effect waves-light"
         onClick={postFun} >
         Login
       </button>
       <p>Create new account ? <Link to ="/signup" ><span className='login-span'>Signup</span></Link></p>
      </div>
  </div>
  )
}

export default Login
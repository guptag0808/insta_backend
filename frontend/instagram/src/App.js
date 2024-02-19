
import React,{useEffect,createContext,useReducer} from 'react'
import Navbar from "./components/Navbar"

import { BrowserRouter, Route ,Routes,useNavigate} from "react-router-dom"

import Home from "./components/screens/Home"
import Profile from "./components/screens/Profile"
import Login from "./components/screens/Login"
import Signup from "./components/screens/Signup"
import './App.css';
import CreatePost from "./components/screens/CreatePost"
import {reducer,initialState} from "./reducers/userReducers"
 
export const UserContext = createContext()

//checking user is login or not 
const Routing =() =>{
 
    const navigate= useNavigate()
    const navigateToHome = () => {
      navigate('/');
    }; const navigateToLogin = () => {
      navigate('/login');
    };

    useEffect(()=>{
      const user= JSON.parse(localStorage.getItem('user'))
       if(user){
         navigateToHome()
       }else{
        navigateToLogin()
       }
    },[])
    return (
      <>
        <Routes>
            <Route exact path="/" element={ <Home />} />
            <Route path="/login" element ={ <Login />} />
            <Route path="/signup" element = {<Signup />} /> 
            <Route path="/profile" element = { <Profile />} />
            <Route path="/create" element = { <CreatePost />} />
        </Routes>
    </>
    )
}

function App() {
  const [state,dispatch] =useReducer(reducer,initialState)
  return (
    <UserContext.Provider value= {{state,dispatch}}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

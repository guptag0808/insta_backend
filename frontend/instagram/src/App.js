import React, { useEffect, createContext, useReducer } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import './App.css';
import "./index.css"
import CreatePost from './components/screens/CreatePost';
import { reducer, initialState } from './reducers/userReducers';
import UserProfile from './components/screens/UsersProfile';

export const UserContext = createContext();

const  Routing = () =>{
  // console.log("Routing component rendered")
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
      console.log("user is present",user)
      navigate('/');
    } else {
      console.log("user is absent ")
      navigate('/login');
    }
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/userProfile/:Id" element={<UserProfile />} />
    </Routes>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
      
        
        <Routing />
      </BrowserRouter>

    </UserContext.Provider>
  );
}

export default App;

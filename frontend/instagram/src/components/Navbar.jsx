import { Link, useNavigate } from "react-router-dom";
import React,{useContext} from "react";
// import { useState, useEffect } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import { UserContext } from "../App";

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'))
  console.log(user,"this is user")
  const {state,dispatch}= useContext(UserContext)
  const navigate = useNavigate();

  const logoutFun = () => {
    localStorage.clear();
    M.toast({ html: 'Logout Successful', classes: '#ef5350 red lighten-1' });
    navigate("/login");
  };

  const renderList = () => {
    console.log(state ,"this is state")
    if (user) {
     
      return [
        
         <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/create">Create Post</Link></li>,
          <li>
            <button className="btn waves-effect waves-light" onClick={logoutFun}>
              Logout
            </button>
          </li>
       
      ]
      
    } else {
      return [
        <li><Link to="/login">Login</Link></li>,
          <li><Link to="/signup">Signup</Link></li>
      ]
    }
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to={user ? "/" : "/login"} className="brand-logo left">
          InstaFlick
        </Link>
        <ul id="nav-mobile" className="right ">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

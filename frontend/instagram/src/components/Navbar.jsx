
import {Link,useNavigate} from "react-router-dom"
 import M from "materialize-css"
function Navbar() {
const navigate= useNavigate()

    const logoutFun = ()=>{
      localStorage.clear()
      M.toast({html: 'Logout Successful' , classes:'#ef5350 red lighten-1'})
      navigate("/login")
    }
   let token
  const renderList = ()=>{
     token =localStorage.getItem('Token')
      if(token){
        return(
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/create">Create Post</Link></li>
            <li>  
              <button className="btn waves-effect waves-light" onClick={()=>logoutFun()}>
                  Logout
              </button>
            </li>
          </>
        )
    }else{
      return(
        <>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </>
      )
    }
  }

  return (
            <nav>
                <div className="nav-wrapper">
                  <Link to="/" className="brand-logo left">InstaFlick</Link>
                      <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {renderList()}
                      </ul>
                </div>
            </nav> 
         )
}

export default Navbar
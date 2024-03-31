import React from 'react'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import M from 'materialize-css'
function CreatePost() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url,setUrl] = useState("")

   useEffect(()=>{
      if(url){
		  fetch("https://grumpy-bee-pinafore.cyclic.app/post/createpost",{
		  method:"post",
		  headers:{
			"Content-Type":"application/json",
			"Authorization":localStorage.getItem("Token")
		  },
		  body:JSON.stringify({
			title,
			body,
			photo:url})
			 
		})
		.then(res=>res.json())
		.then(data=>{
		   if(data.error){
			M.toast({html: data.error ,classes:'#b71c1c red darken-4'})
		   }else{
			M.toast({html: data.msg , classes:'#00bfa5 teal accent-4'})
			  navigateToLogin()
		   }
		})
		.catch(err=>{
		   console.log(err.message)
		})
	 }
   },[url]) ;
  //redirect to Home page
  
  const navigate= useNavigate()
  const navigateToLogin = () => {
    navigate('/');
  }; 
  //this is for cloudaniry
    const cloudFun= ()=>{
		const data = new FormData()
		data.append("file",image)
		data.append("upload_preset","FotoFlick")
		data.append("cloud_name","dlhjyckpv")

		fetch('https://api.cloudinary.com/v1_1/dlhjyckpv/image/upload',{
			method:"post",
			body:data
		})
		.then(res=>res.json())
		.then(data=>{
			console.log(data)
			setUrl(data.url)
			
		})
		.catch(err=>{
			console.log(err)
		})
	}

	//calling createPost routes
	
  return (
	<div className='card input-field' style={{
		maxWidth:"500px",
		margin:"20px auto",
		padding:"20px",
		textAlign:"center"
	}}> 
	    <h4 style={{color:"grey",}}>Upload Your Picture</h4>
		 <input type="text" placeholder='title' 
		  value={title}
		  onChange={(e)=>setTitle(e.target.value)}
		 />
		 <input type="text" placeholder='Body' 
		  value={body}
		  onChange={(e)=>setBody(e.target.value)} 
		 />
		<div className="file-field input-field">
			<div className="btn">
				<span>Upload Image</span>
				<input type="file" 
				 
				onChange={(e)=>setImage(e.target.files[0])}
				 />
			</div>
			<div className="file-path-wrapper">
				<input className="file-path validate" type="text" />
			</div>
       </div>
	   <button className="btn waves-effect waves-light" 
	   onClick={()=>cloudFun()}
	    >
         Submit Post
      </button>
	</div>
  )
}

export default CreatePost
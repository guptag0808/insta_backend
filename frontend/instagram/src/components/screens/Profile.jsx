import React, { useState, useEffect } from 'react';
import "../style/profile.css"
import { Link, useNavigate } from 'react-router-dom';
import "../style/profilePic.css"
import M from "materialize-css"
function Profile() {
  const [userProfile, setProfile] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const user = JSON.parse(localStorage.getItem('user'));
  const Id = user._id;
  const navigate = useNavigate();

  const navigateToProfileImg = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {

    fetch(`https://grumpy-bee-pinafore.cyclic.app/user/allPost/${Id}`, {

      headers: {
        'Authorization': localStorage.getItem('Token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        if (url) {
          setProfileFun()
         }
      });
  }, [url]); // Empty dependency array to run the effect only once on mount

  const setProfileFun = () => {

    fetch("https://grumpy-bee-pinafore.cyclic.app/user/profilePic", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("Token")
      },
      body: JSON.stringify({ profilePic: url })
    })
      .then((res) => res.json())
      .then((data) => {
        M.toast({html: "Profile Uploaded SuccessFully" , classes:'#00bfa5 teal accent-4'})
        console.log("uploaded sucessfully")
        closeDialog()
      })
  }
   
  const removeProfile = ()=>{
    fetch("https://grumpy-bee-pinafore.cyclic.app/user/remove", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("Token")
      },
      body: JSON.stringify({ profilePic: url })
    })
      .then((res) => res.json())
      .then((data) => {
        M.toast({html: "Profile Pic Deleted SuccessFully" , classes:'#00bfa5 teal accent-4'})
        console.log("Remove Profile ")
        closeDialog()
      })
  }

  // to generate a link of image
  const cloudFun = () => {
    if(image){
      const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "FotoFlick")
    data.append("cloud_name", "dlhjyckpv")

    fetch('https://api.cloudinary.com/v1_1/dlhjyckpv/image/upload', {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        console.log(data, "set cloudinary data")
        setUrl(data.url)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
  return (
    <>
      {userProfile ?
        <div className={`container ${isDialogOpen ? 'overlay-open' : ''}`} style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div
            className='profile-div'
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: '20px 0',
              borderBottom: '2px solid grey',
            }}
          >
            <div className='profile_div_image'  style={{ width: '160px', height: '160px', borderRadius: '50%',backgroundColor:"green" }}>
              <img
                style={{ width:"100%",height:"100%", borderRadius:"50%" }}
                src={url ? url : userProfile.user.profilePic}
                alt='profile pic'
              />
              <button className='profileBtn' onClick={navigateToProfileImg} >Edit Profile</button> </div>
              {isDialogOpen && (
                <div className="dialog-overlay">
                  <div className="dialog-box">
                    <i class="material-icons" style={{ float: "right", cursor: "pointer" }} onClick={closeDialog} >clear</i>
                    <div className='imageDiv' ><img className='proImg' src={image ? URL.createObjectURL(image) : userProfile.user.profilePic} alt="" /></div>
                    <div className="file-field input-field">
                      <div className="btn">
                        <span>Upload</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                      </div>
                      <div class="file-path-wrapper">
                        <input class="file-path validate"  type="text" onChange={(e) => setImage(e.target.files[0])} />
                      </div>
                    </div>
                    <button onClick={removeProfile}  className='Remove-buton btn waves-effect waves-light'>Remove Current Photo</button><br></br>
                   {/* <span>Upload Photo</span><input type="file" onChange={(e) => setImage(e.target.files[0])} /> */}

                    {/* <div class="file-field input-field">
                      <div class="btn">
                        <span>Upload Photo</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                      </div>
                    </div> */}
                    {/* <span>Remove Photo</span><input type="file" /> */}
                    {/* <p>cancel</p> */}
                    <button  className="close-btn btn waves-effect waves-light"onClick={() => cloudFun()} >Upload</button>
                  </div>
                </div>
              )}

            
            <div className='h4-h6'>
              <h4>{userProfile.user.name} </h4>
              <h5>{userProfile.user.email} </h5>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '110%' }}>
                <h6>{userProfile.userPosts ? userProfile.userPosts.length : "0"} Post</h6>
                <h6>{userProfile.user.followers.length} Followers</h6>
                <h6>{userProfile.user.following.length} Following</h6>
              </div>
            </div>
          </div>
          <div className='gallery'>
            {userProfile.userPosts ? userProfile.userPosts.map((item) => (
              <img key={item._id} className='galleryPhotos' src={item.photo} alt={item.title} />
            )) : ""}
          </div>
        </div>
        : <h1 style={{ display: 'flex', justifyContent: "center" }}>...Loding</h1>}
    </>
  );
}

export default Profile;

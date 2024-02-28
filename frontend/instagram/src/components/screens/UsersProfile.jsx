import React, { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom'
function UserProfile() {
  const [userProfile, setProfile] = useState(null);
  const [followers,setFollowers]= useState("")
  const {Id}= useParams()
   
  const user = JSON.parse(localStorage.getItem('user'));
 

  useEffect(() => {
    fetch(`http://localhost:5000/user/allPost/${Id}`, {
    
      headers: {
        'Authorization': localStorage.getItem('Token'),
      },
    })    
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setProfile(data);
      });
  }, []); // Empty dependency array to run the effect only once on mount

  const followerFun= ()=>{
    
      fetch(`http://localhost:5000/user/follow/${Id}`, {
        method:"PATCH",
        headers: {
          'Authorization': localStorage.getItem('Token'),
        },
      })    
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setFollowers(data.follower.followers.length || 1)
          
        });
   
  }

  return (
<>
{userProfile ? 
  <div className='container' style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div
        className='profile-div'
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          margin: '20px 0',
          borderBottom: '2px solid grey',
        }}
      >
        <div>
          <img
            style={{ width: '160px', height: '160px', borderRadius: '100px' }}
            src='https://media.istockphoto.com/id/483614130/photo/walking-with-retriever.webp?b=1&s=170667a&w=0&k=20&c=6KXMplPsXCLLxivYHNfJsZ3WBTfkBYfjvMQTuUjxVTs='
            alt='profile pic'
          />
        </div>
        <div className='h4-h6'>
              <h4>{userProfile.user.name} </h4>
              <h5>{userProfile.user.email} </h5>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '110%' }}>
              <h6>{userProfile.userPosts.length} Post</h6>
              <h6>{userProfile.user.followers.length} Followers</h6>
              <h6>{userProfile.user.following.length} Following</h6>
            </div> 
            <button className="btn waves-effect waves-light"
         onClick={followerFun} >
          Follow
       </button>
            
          
        </div>
      </div>
      <div className='gallery'>
        {userProfile.userPosts.map((item) => (
          <img key={item._id} className='galleryPhotos' src={item.photo} alt={item.title} />
          
        ))}
      </div>
    </div>
: <h1 style={{display:'flex', justifyContent:"center"}}>...Loding</h1>}

</>

   
  );
}

export default UserProfile;

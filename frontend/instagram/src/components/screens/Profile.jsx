import React, { useState, useEffect } from 'react';

function Profile() {
  const [userProfile, setProfile] = useState(null);
 
  
   
  const user = JSON.parse(localStorage.getItem('user'));
  const Id= user._id

  useEffect(() => {
    fetch(`http://localhost:5000/user/allPost/${Id}`, {
    
      headers: {
        'Authorization': localStorage.getItem('Token'),
      },
    })    
      .then((res) => res.json())
      .then((data) => {
        console.log(data,"setProfile data")
        setProfile(data);
      });
  }, []); // Empty dependency array to run the effect only once on mount

 

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
              <h6>{userProfile.userPosts ?userProfile.userPosts.length : "0" } Post</h6>
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
: <h1 style={{display:'flex', justifyContent:"center"}}>...Loding</h1>}

</>

   
  );
}

export default Profile;

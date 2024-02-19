import React, { useState, useEffect } from 'react';

function Profile() {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);
  const name = user.name;

  useEffect(() => {
    fetch('http://localhost:5000/post/mypost', {
      headers: {
        'Authorization': localStorage.getItem('Token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.msg);
      });
  }, []); // Empty dependency array to run the effect only once on mount

  return (
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
        <div>
          <h4>{name}</h4>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '110%' }}>
            <h6>40 Post</h6>
            <h6>40 Followers</h6>
            <h6>40 Following</h6>
          </div>
        </div>
      </div>
      <div className='gallery'>
        {data.map((item) => (
          <img key={item._id} className='galleryPhotos' src={item.photo} alt={item.title} />
        ))}
      </div>
    </div>
  );
}

export default Profile;

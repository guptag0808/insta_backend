import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import "../style/home.css"

function Home() {
   const [data, setData] = useState([])
   const [comment, setComment] = useState("")
   const user = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
      fetch('https://backend-insta-deploy.onrender.com/post/allPost', {
         method: 'GET',
         headers: {
            "Authorization": localStorage.getItem("Token")
         }
      })
         .then(res => res.json())
         .then((data) => {  
            console.log(data.msg)
            setData(data.msg)
         })
   }, [])

   const likeFun = (id) => {
      fetch(`https://backend-insta-deploy.onrender.com/post/like/${id}`, {
         method: 'PUT',
         headers: {  

            "Authorization": localStorage.getItem("Token")
         }
      })
         .then(res => res.json())
         .then((data) => {
            setData(data.msg)
         })
   }


   //  for comments
   const commentFun = (id, comment) => {

      fetch(`https://backend-insta-deploy.onrender.com/post/comment/${id}`, {
         method: 'PUT',
         headers: {
            "Authorization": localStorage.getItem("Token"),
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ comment })
      })
         .then(res => res.json())
         .then((result) => {

            const newData = data.map(item => {
               if (item._id === result.msg._id) {
                  console.log(result)
                  return result.msg
               } else {
                  return item
               }
            })

            setData(newData);
         })
         .catch((err) => {
            console.log(err.message)
         })
   }


   const handleSubmit = (postId) => {

      const inputValue = comment;

      commentFun(postId, inputValue);
      setComment("")
   };

   //  for delete
   const deleteFun = (id) => {

      fetch(`https://backend-insta-deploy.onrender.com/post/delete/${id}`, {
         method: 'DELETE',
         headers: {
            "Authorization": localStorage.getItem("Token"),
         }

      })
         .then(res => res.json())
         .then((result) => {

            const newData = data.filter(item => {
               return item._id !== result.postId
            })

            setData(newData);
         })
         .catch((err) => {
            console.log(err.message)
         })
   }
   // delete comments
   const deleteCommentFun = (postId, commentId) => {
      console.log(postId, commentId)
      fetch(`https://backend-insta-deploy.onrender.com/post/comment/${postId}/${commentId}`, {
         method: 'DELETE',
         headers: {
            Authorization: localStorage.getItem('Token'),
         },
      })
         .then((res) => res.json())
         .then((result) => {
            console.log(result)


            setData(result.post);
         })
         .catch((err) => {
            console.log(err.message);
         });
   };

   return (
      <div className='homeContainer'>
         {
            data.map((items) => {
               return (
                  <div className='card home-card' key={items._id}>
                     <div style={{ width: "3rem", position: "absolute", margin: "4px 8px", height: "3rem", borderRadius: "50%", border: "2px solid red" }}>
                       <img className='profileImg' width="100%" src={items.postedBy.profilePic} alt="" />
                     </div>
                     <h5 id='postName' style={{ marginLeft: "60px", fontSize: "1.33rem", marginBottom: "13px", lineHeight: "145%", paddingTop: "13px" }}>
                        <Link style={{ color: "#596469" }} to={`userProfile/${items.postedBy._id}`}>{items.postedBy.name}</Link> {items.postedBy._id === user._id &&
                           <i className="material-icons " style={{ float: "right", cursor: "pointer" }} onClick={() => {
                              deleteFun(items._id)
                           }} >delete</i>
                        }

                     </h5>
                     <div className='img-div' onDoubleClick={() => likeFun(items._id)} >
                        <img width="100%" src={items.photo} alt="" />
                     </div>
                     <div className='card-content'>
                        <i className={`material-icons  ${items.likes.includes(user._id) ? 'red-heart' : 'black-heart'}`}
                           onClick={() => {
                              likeFun(items._id)
                           }} >{items.likes.includes(user._id) ? 'favorite' : 'favorite_border'}</i>
                        <h6>likes {items.likes.length}</h6>
                        <h6>{items.title}</h6>
                        <p>{items.body}</p>
                        <p style={{ color: "grey" }}>See Comments...</p>
                        {/* Display comments */}
                        <div className='comments-section'>
                           {items.comments.map((comment, index) => (
                              <div key={index} className='comment'>
                                 <strong style={{ fontWeight: "bold" }}>{comment.postedBy.name}</strong>: {comment.comment}
                                 {(comment.postedBy._id === user._id || items.postedBy._id === user._id) && (
                                    <i
                                       className='material-icons deleteComment'
                                       style={{ float: 'right', cursor: 'pointer' }}
                                       onClick={() => deleteCommentFun(items._id, comment._id)}
                                    >
                                       delete
                                    </i>
                                 )}
                              </div>
                           ))}
                        </div>

                        <div className='commentInput' style={{ display: "flex" }}>
                           {/* <form key={items._id} onSubmit={(e) => handleSubmit(e, items._id)}>
                              <input type="text" placeholder='add a comment' style={{display:"inline-block"}}/>
                              <i className="material-icons sendIcon" style={{float:"right"}} onClick={(e) => handleSubmit(e, items._id)}>send</i>
                           </form> */}
                           <input type="text" placeholder='add a comment' style={{ display: "inline-block" }}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                           />
                           <i className="material-icons sendIcon" style={{ float: "right", cursor: "pointer" }} onClick={(e) => handleSubmit(items._id)}>send</i>
                        </div>

                     </div>
                  </div>
               )
            })
         }
      </div>
   )
}

export default Home
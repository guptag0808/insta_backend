import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
   const [data, setData] = useState([])
   const [comment, setComment] = useState("")
   const user = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
      fetch('http://localhost:5000/post/allPost', {
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
      fetch(`http://localhost:5000/post/like/${id}`, {
         method: 'PUT',
         headers: {

            "Authorization": localStorage.getItem("Token")
         }
      })
         .then(res => res.json())
         .then((data) => {
            console.log(data.msg)
            setData(data.msg)
         })
   }

   const isPostLiked = (id) => {
      const likedPost = data.find((item) => item._id === id)
      return likedPost && likedPost.likes.length > 0;
   };

   //  for comments
   const commentFun = (id, comment) => {

      fetch(`http://localhost:5000/post/comment/${id}`, {
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

   // const handleSubmit = (e, postId) => {
   //    e.preventDefault();
   //    const inputValue = e.target[0].value;

   //    commentFun(postId, inputValue);
   // };
   const handleSubmit = (postId) => {

      const inputValue = comment;

      commentFun(postId, inputValue);
      setComment("")
   };

   //  for delete
   const deleteFun = (id) => {

      fetch(`http://localhost:5000/post/delete/${id}`, {
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
      fetch(`http://localhost:5000/post/comment/${postId}/${commentId}`, {
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
                     <h5 id='postName' style={{ marginLeft: "15px", color: "black" }}>
                        <Link to={`userProfile/${items.postedBy._id}`}>{items.postedBy.name}</Link> {items.postedBy._id === user._id &&
                           <i className="material-icons sendIcon" style={{ float: "right", cursor: "pointer" }} onClick={() => {
                              deleteFun(items._id)
                           }} >delete</i>
                        }

                     </h5>
                     <div>
                        <img width="100%" src={items.photo} alt="" />
                     </div>
                     <div className='card-content'>
                        <i className={`material-icons abcd ${isPostLiked(items._id) ? 'red-heart' : ''}`}
                           onClick={() => {
                              likeFun(items._id)
                           }} >favorite_border</i>
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
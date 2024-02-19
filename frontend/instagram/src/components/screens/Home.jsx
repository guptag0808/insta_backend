import React,{useState,useEffect} from 'react'

function Home() {
   const [data,setData] = useState([])
 
  
   
      useEffect(()=>{
             fetch('http://localhost:5000/post/allPost',{
               method:'GET',
               headers:{
                  "Authorization": localStorage.getItem("Token")
               }
            })
            .then(res=>res.json())
            .then((data)=>{ 
               console.log(data.msg)
               setData(data.msg)
            })
      },[])

      const likeFun = (id)=>{
         fetch(`http://localhost:5000/post/like/${id}`,{
               method:'PUT',
               headers:{

                  "Authorization": localStorage.getItem("Token")
               }
            })
            .then(res=>res.json())
            .then((data)=>{ 
              
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
            
            const newData= data.map(item=>{
               if(item._id===result.msg._id){
                  return result.msg
               }else{
                  return item
               }
            })
            
           setData(newData);
         })
         .catch((err)=>{
            console.log(err.message)
         })
       }
        const handleSubmit = (e, postId) => {
         e.preventDefault();
         const inputValue = e.target[0].value;
        
         commentFun(postId, inputValue);
       };
  return (
<div className='homeContainer'>  
   {
      data.map((items)=>{
         return(
            <div className='card home-card' key={items._id}>
         <h5 style={{fontWeight:"500",marginLeft:"15px"}}>{items.postedBy.name}</h5>
         <div>
          <img width="100%" src={items.photo} alt="" />
         </div>
         <div className='card-content'>
         <i  className={`material-icons abcd${isPostLiked(items._id) ? 'red-heart' : ''}`}
            onClick={()=>{
            likeFun(items._id)
         }} >favorite_border</i>
         <h6>likes {items.likes.length}</h6>
          <h6>{items.title}</h6>
          <p>{items.body}</p>
          {/* Display comments */}
          <div className='comments-section'>
              {items.comments.map((comment, index) => (
                <div key={index} className='comment'>
                  <strong style={{fontWeight:"500"}}>{comment.postedBy.name}</strong>: {comment.comment}
                </div>
              ))}
            </div>
         <div className='commentInput'>
         <form key={items._id} onSubmit={(e) => handleSubmit(e, items._id)}>
                  <input type="text" placeholder='add a comment'  />
                  <i className="material-icons sendIcon" onClick={(e) => handleSubmit(e, items._id)}>send</i>
                </form>

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
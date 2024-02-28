const express = require('express')
const postRouter = express.Router()
const { PostModel } = require('../models/post')
const { authentication } = require('../middleware/authentication')  

// upload post by login user
postRouter.post('/createpost', authentication, async (req, res) => {
	const { title, body, photo } = req.body

	const user = req.user
	if (!title || !body || !photo) {
		return res.status(422).json({ error: "PLease Add All The Fields" })
	}
	try {
		user.password = undefined
		const post = new PostModel({
			title,
			body,
			photo,
			postedBy: user
		})
		post.save()
		res.status(200).send({ "msg": "Post Uploded Succesfull", post })
	} catch (err) {
		res.send({ error: err.message })
	}
})

// get all post
postRouter.get("/allpost", async (req, res) => {
	try {
		const allPost = await PostModel.find().populate("postedBy", "_id name").populate("comments.postedBy","name _id")
		// console.log(allPost)
		res.status(200).send({ "msg": allPost })

	} catch (err) {
		res.send({ "msg": err.message })
	}
})

// get all post uploaded by login user

postRouter.get("/mypost", authentication, async (req, res) => {
	const userId = req.userId
	
	try {
		const myAllPost = await PostModel.find({ postedBy: userId }).populate("postedBy", "name _id")
		res.status(200).send({ "msg": myAllPost })
	} catch (err) {
		res.json(err.message)
	}
})

// likes Routes

postRouter.put("/like/:id", authentication, async (req, res) => {
	const userID = req.userId
	const postId = req.params.id
	// console.log(postId)
	try {
		const post = await PostModel.findById(postId);

		const userIndex = post.likes.indexOf(userID);

		// If the user has not liked the post, add the user ID to the likes array
		if (userIndex === -1) {
			post.likes.push(userID);
		} else {
			// If the user has already liked the post, remove the user ID from the likes array
			post.likes.splice(userIndex, 1);
		}
		// Save the updated post to the database
		await post.save();
		const allPost = await PostModel.find().populate("comments.postedBy","name _id").populate("postedBy","name _id")
		// Send the updated post back to the client
		res.status(200).send({ "msg": allPost });
	} catch (err) {
		console.error(err.message); 
		res.status(500).send('Internal Server Error');
	}
})

//comments routes
postRouter.put("/comment/:id", authentication, async (req, res) => {
	const postId = req.params.id;
	const { comment } = req.body;
	console.log(comment)
	const userId = req.userId;
	const data = { comment, postedBy: userId };
   
	try {
	  // Use the `await` keyword to wait for the update operation to complete
	  const post = await PostModel.findByIdAndUpdate(
		postId,
		{ $push: { comments: data } },
		{ new: true } // To get the updated document after the update operation
	  ).populate("comments.postedBy","name _id").populate("postedBy" ,"name _id")
	  
       console.log(post)
	  // Send the updated post with comments populated back to the client
	  res.status(200).send({"msg":post});
	} catch (err) {
	  console.error(err.message);
	  res.status(500).send('Internal Server Error');
	}
  });
  
  postRouter.delete("/delete/:id", authentication, async (req, res) => {
	const userId = req.userId;
	const postId = req.params.id;
  
	try {
	  const post = await PostModel.findById(postId).populate("postedBy", "_id");
  
	  if (!post) {
		return res.status(404).json({ error: "Post not found" });
	  }
  
	  if (userId === post.postedBy._id.toString()) {
		// Convert post.postedBy._id to a string for comparison
		await PostModel.findByIdAndDelete(postId);
		res.status(200).send({ "msg": " deleted successfully" ,"postId":postId});
	  } else {
		res.status(403).json({ error: "You are not authorized to delete this post" });
	  }
  
	} catch (err) {
	  console.error(err.message);
	  res.status(500).send('Internal Server Error');
	}
  });
  
//   Delete Comments
  postRouter.delete("/comment/:postId/:commentId", authentication, async (req, res) => {
	const userId = req.userId;
	const postId = req.params.postId; 
	const commentId = req.params.commentId;
  
	try {
	  const post = await PostModel.findById(postId);
  
	  if (!post) {
		return res.status(404).json({ error: "Post not found" });
	  }
  
	  // Find the comment index in the post's comments array
	  const commentIndex = post.comments.findIndex(item => item._id == commentId);
  
	  if (commentIndex === -1) {
		return res.status(404).json({ error: "Comment not found" });
	  }
  
	  const comment = post.comments[commentIndex];
  
	  if (userId === comment.postedBy._id.toString() || userId === post.postedBy._id.toString()) {
		// Delete the comment
		post.comments.splice(commentIndex, 1);
		await post.save();
		const allPost = await PostModel.find().populate("postedBy", "_id name").populate("comments.postedBy","name _id")
		res.status(200).json({ msg: "Comment deleted successfully", "post":allPost});
	  } else {
		res.status(403).json({ error: "You are not authorized to delete this comment" });
	  }
  
	} catch (err) {
	  console.error(err.message);
	  res.status(500).send('Internal Server Error');
	}
  });
  
  
  
module.exports = { postRouter }
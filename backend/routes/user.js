const express = require('express') 
const userProfile = express.Router()
const { PostModel } = require('../models/post')
const {UserModel } = require('../models/user')
const { authentication } = require('../middleware/authentication')

userProfile.get("/allPost/:Id", authentication, async (req, res) => {
	const requestedUserId = req.params.Id;
	const userId = req.userId;
  console.log(requestedUserId)  
	try { 
	  const user = await UserModel.findById( requestedUserId )
	  const userPosts = await PostModel.find({ postedBy: requestedUserId })
      console.log(userPosts)
	  if (!userPosts || userPosts.length === 0) {
		return res.status(200).json({ user});
	  }
  
	  res.status(200).json({ user, userPosts });
  
	} catch (err) {
	  console.error(err.message);
	  res.status(500).json({ msg: err.message });
	}
  });


//    for followers
userProfile.patch("/follow/:followerId", authentication, async (req, res) => {
	const userId = req.userId;
	const followerId = req.params.followerId;
  
	try {
	  const follower = await UserModel.findById(followerId);
	  const following = await UserModel.findById(userId);
  
	  const isFollower = follower.followers.includes(userId);
  
	  if (!isFollower) {
		follower.followers.push(userId);
		await follower.save();
	  }
  
	  if (following) {
		following.following.push(followerId);
		await following.save();
	  }
  
	  // Fetch the updated documents after saving changes
	  const updatedFollower = await UserModel.findById(followerId);
	  const updatedFollowing = await UserModel.findById(userId);
  
	  res.status(200).json({ follower: updatedFollower, following: updatedFollowing });
	} catch (err) {
	  console.error(err.message);
	  res.status(500).json({ msg: err.message });
	}
  });
  
  

  // for unFollow
  userProfile.patch("/unfollow/:followerId", authentication, async (req, res) => {
	const userId = req.userId;
	const followerId = req.params.followerId;
  
	try {
	  const follower = await UserModel.findById(followerId);
	  const following = await UserModel.findById(userId);
  
	  const isFollower = follower.followers.includes(userId);
  
	  if (isFollower) {
		follower.followers.pull(userId);
		await follower.save(); 
	  }
  
	  if (following) {
		following.following.pull(followerId); 
		await following.save();
	  }
  
	  // Fetch the updated documents after saving changes
	  const updatedFollower = await UserModel.findById(followerId);
	  const updatedFollowing = await UserModel.findById(userId);
  
	  res.status(200).json({ follower: updatedFollower, following: updatedFollowing });
	} catch (err) {
	  console.error(err.message);
	  res.status(500).json({ msg: err.message });
	}
  });
  



module.exports={
	userProfile
}  
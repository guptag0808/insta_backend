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
		return res.status(200).json({ msg: [] });
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
	  const follower = await UserModel.findOne({ _id: followerId });
	  const following = await UserModel.findOne({ _id: userId });
  
	  const isFollower = follower.followers.includes(userId);
  
	  if (!isFollower) {
		const updatedFollower = await UserModel.findByIdAndUpdate(
		  followerId,
		  { $push: { followers: userId } },
		  { new: true }
		);
	  }
  
	  if (following) {
		const updatedFollowing = await UserModel.findByIdAndUpdate(
		  userId,
		  { $push: { following: followerId } },
		  { new: true }
		);
	  }
  
	  res.status(200).json({ follower, following });
	} catch (err) {
	  console.error(err.message);
	  res.status(500).json({ msg: err.message });
	}
  });
  

  // for unFollow
  userProfile.patch("/follow/:followerId", authentication, async (req, res) => {
	const userId = req.userId;
	const followerId = req.params.followerId;
  
	try {
	  const follower = await UserModel.findOne({ _id: followerId, followers: userId });
	  const following = await UserModel.findOne({ _id: userId, following: followerId });
	  console.log(follower)
  
	  if (!follower) {
		const user = await UserModel.findByIdAndUpdate(
		  followerId,
		  { $pull: { followers: userId } },
		  { new: true }
		);
	  }
  
	  if (!following) {
		const loginUser = await UserModel.findByIdAndUpdate(
		  userId,
		  { $pull: { following: followerId } },
		  { new: true }
		);
	  }
  
	  res.status(200).json({ follower,following });
  
	} catch (err) {
	  console.error(err.message);
	  res.status(500).json({ msg: err.message });
	}
  });
  module.exports = userProfile;



module.exports={
	userProfile
}  
const express= require('express')
const postRouter = express.Router()
const {PostModel} = require('../models/post')
const {authentication} = require('../middleware/authentication')

// upload post by login user
postRouter.post('/createpost',authentication,async(req,res)=>{
    const {title,body,photo} = req.body
	const userId= req.userId
	const user = req.user
      if(!title || !body ){
		return res.status(422).json({error:"PLease Add All The Fields"})
	  }
	try{
		user.password=undefined 
       const post = new PostModel({
		title,
		body,
		postedBy:user
	   })
	   post.save()
	   res.status(200).send({"msg":"Post Uploded Succesfull",post})
	}catch(err){
		res.send({"msg":"Post is Uploaded Successfully"})
	}
})

// get all post
postRouter.get("/allpost",async(req,res)=>{
	try{
		const allPost = await PostModel.find().populate("postedBy","_id name")
		res.status(200).send({"msg":allPost})
	}catch(err){
		res.send({"msg":err.message})
	}
})

// get all post uploaded by login user

postRouter.get("/mypost",authentication,async(req,res)=>{
    const userId=req.userId
	console.log(userId)
	try{
		const myAllPost = await PostModel.find({postedBy:userId}).populate("postedBy","name _id")
		res.status(200).send({"msg":myAllPost})
	}catch(err){
		res.json(err.message)
	}
})

module.exports={postRouter}
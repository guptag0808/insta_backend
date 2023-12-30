const mongoose = require('mongoose')

const postSchema= new mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	body:{
		type:String,
		required:true
	},
	photo:{
		type:String,
		default:"No Photo"
	},
	postedBy:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"

	}
},{versionKey: false})

const PostModel = mongoose.model("Post",postSchema)

module.exports={PostModel}
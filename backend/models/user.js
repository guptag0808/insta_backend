const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	followers:[
		{
			type:mongoose.Schema.Types.ObjectId,
		    ref:"User"
		}
	],
	following:[
		{
			type:mongoose.Schema.Types.ObjectId,
		    ref:"User"
		}
	],
	profilePic:{
		type:String
	}
},{versionKey: false})



const UserModel =mongoose.model('User',userSchema)

module.exports={
	UserModel
}
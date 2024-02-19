const express= require("express")
const app= express()
const cors= require("cors")
const {connection}=require('./db')
const {userRouter} = require('./routes/auth')
const {postRouter} = require('./routes/post')
const PORT= 5000

app.use(cors())

//parsing the req.body 
app.use(express.json())

app.use("/auth",userRouter)
app.use("/post",postRouter)

app.get("/home",(req,res)=>{
	res.send('THIS IS HOME PAGE')
})


app.listen(PORT,async()=>{
	try{
		await connection 
		console.log('Server is connected to DB')
	}catch(err){
		console.log(err.message)
	}
	console.log("server is running at ",PORT)  
})


const express = require('express')
const mongoose = require('mongoose')
const Note = require('./models/Note')
const User= require('./models/User')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try{
  mongoose.connect('mongodb://localhost:27017/todoapp')
  console.log("Connected")
}
catch(error){
  console.log("Error")
}



app.get('/', (req, res) => {
    res.sendFile("pages/index.html", { root: __dirname })
})

app.get('/login', (req, res) => {
  res.sendFile("pages/login.html", { root: __dirname })
})

app.get('/signup', (req, res) => {
  res.sendFile("pages/signup.html", { root: __dirname })
})


//End points for API

app.post('/getnotes',async (req,res)=>{
  let notes = await Note.find({email: req.body.email})
  res.status(200).json({success:true,notes})
    // const {userToken} = req.body
    
})
app.post('/login',async(req,res)=>{
    const {userToken} = req.body
    let user=await User.findOne(req.body)
    console.log(user)
    if(!user){
      // console.log("hi")
      res.status(200).json({success:false,message:"No user found"})
    }
    else{
      // console.log("hii")
      res.status(200).json({success:true,user :{email: user.email},message:"Found"})
    }
    
})
app.post('/signup',async (req,res)=>{
    const {email,password} = req.body
    try{
      let existinguser=await User.findOne({email});
      if(existinguser!==null){
        res.status(200).json({success:false})
      }
    
      const user=await User.create({email,password});
      res.status(200).json({success:true,user:user})
    }
    catch(error){
      console.log(error)
    
    }
})

app.post('/addnote',async (req,res)=>{
    const {userToken} = req.body
    let note = await Note.create(req.body)
    console.log(req.body)
    res.status(200).json({success:true,note})
    
})
app.post('/deletenote',async (req,res)=>{
    // const {userToken} = req.body
    const {id} =req.body
    await Note.deleteOne({_id:id});
    res.status(200).json({success:true});
    
})


app.listen(port, () => {
  console.log(`Example app listening on ports http://localhost:${port}`)
})

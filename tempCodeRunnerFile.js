const express = require('express')
const path= require('path');
const app = express()
const pool =require("./db");
const port = 3654

app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.post("/postUser", async(req,res)=>{
    try{
      console.log(req.body);
    }
    catch (err){
      console.log(err.message);
    }
})


// app.get('/home',(req,res)=>{
//   res.sendFile(path.join(__dirname,'index.html'))
// })


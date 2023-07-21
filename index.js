// use packages
// load .env file contents into process.env
require('dotenv').config()
const express=require('express')
const cors =require('cors')
require('./db/connection')
const router =require('./routes/router')

// import
const middleware =require('./middleware/authMiddlewarw')
// create express application
const  bankserver=express()

// use cors
bankserver.use(cors())

//use json parser in server
bankserver.use(express.json()) 
bankserver.use(middleware.appMiddlewares)

// use router
bankserver.use(router)
// setup a port number to listen server
const port = 3000 ||process.env.PORT

// run/listen server app
bankserver.listen(port,()=>{
    console.log(`Bank server started at port number:${port}`);
})

//: how to resolve http( get request ) request
bankserver.get("/",(req,res)=>{
    res.status(200).send(`<h1>Bank Server Started...</h1>`)
})

// 
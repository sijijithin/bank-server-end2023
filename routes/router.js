
// import express 
const express = require('express')
const userController=require('../controllers/userController')
const { jwtMiddleware } = require('../middleware/authMiddlewarw')
const middleware=require('../middleware/authMiddlewarw')
// use express to create object for router class
const router = new express.Router()

// request resolving logic for register - http://localhost:3000/register
router.post("/register",userController.register)

// request resolving logic for login --http://localhost:3000/login
router.post("/login",userController.login)

// get balance
router.get("/get-balance/:acno",middleware.jwtMiddleware,userController.getbalance)

// fund transfer
router.post("/fund-transfer",middleware.jwtMiddleware,userController.fundtransfer)

// get transaction
router.get("/get-transaction",middleware.jwtMiddleware,userController.gettransactions)

// delete account
router.delete("/delete-account",middleware.jwtMiddleware,userController.deleteAcno)

module.exports = router   
var UserModel = require('../models/UserModel')
const JWT = require('jsonwebtoken')

module.exports = {
    async getUsers(req,res){

        try{
            var users = await UserModel.getUsers()
            res.status(200).json({users:users})
        }catch(error){
            console.log(error)
            res.status(400).json({msg:error})
        }
    },

    async setUserAdmin(req,res){
        var userEmail = req.body.email 

        if (!userEmail) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await UserModel.setUserAdmin(userEmail)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async setUserSpe(req,res){
        var userEmail = req.body.email 

        if (!userEmail) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await UserModel.setUserSpe(userEmail)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async getUserData(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        try{
            var data = await UserModel.getUserData(user.userID)
            console.log(data)
            res.status(200).json({user:data})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async getUserTransactions(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        try{
            var data = await UserModel.getUserTransactions(user.userID)
            res.status(200).json({transactions:data})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },
}
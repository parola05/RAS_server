var UserModel = require('../models/UserModel')

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
    }
}
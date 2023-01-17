const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

const UserLNFacade_ = require('../business/user_subsystem/UserLNFacade')
const UserLNFacade = new UserLNFacade_()

module.exports = {


    async getUsers(req,res){
        try{
            var users = await UserLNFacade.getUsers()
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
            await UserLNFacade.setUserAdmin(userEmail)
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
            await UserLNFacade.setUserSpe(userEmail)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async getUserData(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        try{
            const data = await UserLNFacade.getUserData(user.userID)
            res.status(200).json({user:data})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async getUserTransactions(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        try{
            console.log("[INVOCAR] UserLNFacade.getUserTransactions")
            var data = await UserLNFacade.getUserTransactions(user.userID)
            res.status(200).json({transactions:data})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async getNotificationsFromUser(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        if(!user){
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            var data = await UserLNFacade.getNotificationsFromUser(user.userID)
            res.status(200).json({notifications:data})
        }catch(error){
            res.status(400).json({msg:error})
        }    
    },

    
    async deposit(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
        var amount = req.body.amount 
        
        if (!amount || !user) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await UserLNFacade.deposit(amount,user.userID)
            res.status(200)
        }catch(err){
            res.status(400).json({msg:err})
        }
    },

    
    async raise(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
        var amount = req.body.amount 
        
        if (!amount || !user) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await UserLNFacade.raise(amount,user.userID)
            res.status(200)
        }catch(err){
            res.status(400).json({msg:err})
        }
    },

    
    async registerUser(req,res){
        var username = req.body.username 
        var password = req.body.password 
        var email = req.body.email 
        var nif = req.body.nif  
        var iban = req.body.iban 
        var birthday = req.body.birthday

        if (!username || !password || !email || !nif || !iban || !birthday) {
            res.status(400).json({msg:"erro na requisição"})
            return
        }

        try{
            await UserLNFacade.registerUser(username,password,email,nif,iban,birthday)
            console.log("[INVOCAR] res.status(200)")
            res.status(200).json({msg:"sucesso"})
        }catch(error){
            res.status(400).json({msg:error})    
        }
    },

    
    async login(req,res){
        var email = req.body.email 
        var password = req.body.password 

        if (!password || !email) {
            res.status(400).json({msg:"erro na requisição"})
            return
        }

        try{
            const token = await UserLNFacade.login(email,password)
            console.log("[INVOCAR] res.status(200) with " + token)
            res.status(200).json({tokenType: "Bearer", token: token})
        }catch(error){
            res.status(400).json({msg:error.message})  
        }   
    },

   
    async editUser(req,res){
        var username = req.body.username 
        var email = req.body.email 
        var nif = req.body.nif  
        var iban = req.body.iban 
        var birthday = req.body.birthday  

        if (!username || !email || !nif || !iban || birthday) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await UserLNFacade.editUser(username,email,nif,iban,birthday)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})    
        }
    }
}
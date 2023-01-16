var UserModel = require('../models/UserModel')
var EventModel = require('../models/EventModel')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

const UserLNFacade_ = require('../models/user_subsystem/UserLNFacade')
const UserLNFacade = new UserLNFacade_()

module.exports = {

    // check [TESTED]
    async getUsers(req,res){
        try{
            var users = await UserLNFacade.getUsers()
            res.status(200).json({users:users})
        }catch(error){
            console.log(error)
            res.status(400).json({msg:error})
        }
    },

    // check [TESTED]
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

    // check [TESTED]
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

    // check [TESTED]
    async getUserData(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        try{
            const data = await UserLNFacade.getUserData(user.userID)
            res.status(200).json({user:data})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    // check [TESTED]
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

    // remove
    async addPromotion(req,res){
        var minAmount = req.body.minAmount 
        var expDate = req.body.expDate
        var perElevation = req.body.perElevation 
        var eventID = req.body.eventID 

        if (!minAmount || !expDate || !perElevation || !eventID) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await UserModel.addPromotion(minAmount,expDate,perElevation,eventID)
            console.log("Promoção adicionada com sucesso")
            const eventSport = await EventModel.getSportFromEvent(eventID)
            const sportType = await EventModel.getSportType(eventSport)

            if(sportType == "c"){
                const teams = await EventModel.getTeamsFromColetiveEvent(eventID)
                var teamsString = teams["equipa1Nome"] + " x " + teams["equipa2Nome"]

                await UserModel.addAllUsersNotification(
                    "Promoção",
                    "Para apostas com um montante mínimo de " + minAmount + " no evento " +
                    teamsString + " os seus ganhos podem ser multiplicados por " + perElevation + "!" +
                    " Válida até " + expDate + "."
                )

                console.log("Notificação adicionada com sucesso")

            }else if(sportType == "d"){
                const players = await EventModel.getPlayersFromDualEvent(eventID)
                var playersString = "" + players["jogador1Nome"] + " x " + players["jogador2Nome"]
    
                await UserModel.addAllUsersNotification(
                    "Promoção",
                    "Para apostas com um montante mínimo de " + minAmount + " no evento " +
                    playersString + " os seus ganhos podem ser multiplicados por " + perElevation + "!" +
                    " Válida até " + expDate + "."
                )
                console.log("Notificação adicionada com sucesso")

            }else if(sportType == "i"){
                // TODO
            }

            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    // check [TESTED]
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

    // check [TESTED]
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

    // check [TESTED]
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

    // check [TESTED]
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

        var passwordHash=bcrypt.hashSync(password, 10);

        try{
            await UserLNFacade.registerUser(username,passwordHash,email,nif,iban,birthday)
            console.log("[INVOCAR] res.status(200)")
            res.status(200).json({msg:"sucesso"})
        }catch(error){
            res.status(400).json({msg:error})    
        }
    },

    // check [TESTED]
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

    // check
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
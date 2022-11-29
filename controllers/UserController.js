var UserModel = require('../models/UserModel')
var EventModel = require('../models/EventModel')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

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
            //console.log(data)
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

    async getNotificationsFromUser(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        if(!user){
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            var data = await UserModel.getNotificationsFromUser(user.userID)
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
            //console.log("Indo pegar saldo do utilizador")
            var userBalance =  (await UserModel.getUserData(user.userID)).balance 
            //console.log("Indo atualizar saldo do utilizador")
            await UserModel.setUserBalance(userBalance + amount,user.userID)
            //console.log("Indo criar transação")
            await UserModel.addUserTransaction("de",amount,user.userID)
            res.status(200)
        }catch(err){
            res.status(400).json({msg:error})
        }
    },

    async raise(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
        var amount = req.body.amount 
        
        if (!amount || !user) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            //console.log("Indo pegar saldo do utilizador")
            var userBalance =  (await UserModel.getUserData(user.userID)).balance 
            //console.log("Indo atualizar saldo do utilizador")
            await UserModel.setUserBalance(userBalance - amount,user.userID)
            //console.log("Indo adicionar transação")
            await UserModel.addUserTransaction("ra",amount,user.userID)
            res.status(200)
        }catch(err){
            res.status(400).json({msg:error})
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

        var passwordHash=bcrypt.hashSync(password, 10);

        try{
            await UserModel.addUser(username,passwordHash,email,nif,iban,birthday)
            res.status(200)
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
            const user = await UserModel.getUserDataByEmail(email)
            var password_hash=user.password
            const verified = bcrypt.compareSync(password, password_hash)

            if(verified){
                JWT.sign({userID: user.iduser}, "Rasbet", {algorithm: 'HS256', noTimestamp: true, expiresIn: '1h' }, function(err, token){
                    if(err){
                         res.status(500).json({msg: "Token falhou"})
                    } else {
                        res.status(200).json({tokenType: "Bearer", token: token})
                    }
                 })
            }else{
                res.status(400).json({msg:"Senha incorreta"})
            }
        }catch(error){
            res.status(400).json({msg:"Utilizador não encontrado"})  
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
            await UserModel.setUserData(username,email,nif,iban,birthday)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})    
        }
    }
}
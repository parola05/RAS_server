const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

var UserDAO = require('./UserDAO')
var TransacaoDAO = require('./TransacaoDAO')
var NotificationDAO = require('./NotificationDAO')

class UserLNFacade {
    userDAO = null 
    transacaoDAO = null
    notificationDAO = null

    constructor(){
        this.userDAO = new UserDAO()
        this.transacaoDAO = new TransacaoDAO(this.userDAO)
        this.notificationDAO = new NotificationDAO()
    }

    async getUsers(){
        console.log("[INVOCAR] userDAO.getUsers()")
        return await this.userDAO.getUsers()
    }

    async setUserAdmin(email){
        console.log("[INVOCAR] userDAO.setUserAdmin()")
        await this.userDAO.setUserAdmin(email)
    }

    async setUserSpe(email){
        console.log("[INVOCAR] userDAO.setUserSpe()")
        await this.userDAO.setUserSpe(email)
    }

    async getUserData(userID){
        console.log("[INVOCAR] userDAO.getUserByID()")
        return await this.userDAO.getUserByID(userID)
    }

    async getUserTransactions(userID){
        console.log("[INVOCAR] transacaoDAO.getTransactionsByUser()")
        return await this.transacaoDAO.getTransactionsByUser(userID)
    }

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
    }

    async getNotificationsFromUser(userID){
        console.log("[INVOCAR] notificationDAO.getNotificationsByUser()")
        return await this.notificationDAO.getNotificationsByUser(userID)  
    }

    async deposit(amount,userID){
        console.log("[INVOCAR] userDAO.getUserByID()")
        var userBalance =  (await this.userDAO.getUserByID(userID)).balance 
        console.log("[INVOCAR] userDAO.setUserBalance() with " + userBalance)
        await this.userDAO.setBalance(userBalance + amount,"de",amount,userID)
    }

    async raise(amount,userID){
        console.log("[INVOCAR] userDAO.getUserByID()")
        var userBalance =  (await this.userDAO.getUserByID(userID)).balance 
        console.log("[INVOCAR] userDAO.setUserBalance()")
        await this.userDAO.setBalance(userBalance - amount,"ra",amount,userID)
    }

    async registerUser(username, password, email, nif, iban, birthday){
        var passwordHash=bcrypt.hashSync(password, 10);
        console.log("[INVOCAR] userDAO.addUser()")
        await this.userDAO.addUser(username, passwordHash, email, nif, iban, birthday)
    }

    async login(email,password){

        console.log("[INVOCAR] userDAO.getUserByEmail()")
        const user = await this.userDAO.getUserByEmail(email)
        const password_hash = user.password

        console.log("[INVOCAR] bcrypt.compareSync with " + password_hash)
        const verified = bcrypt.compareSync(password, password_hash)

        if(verified){
            console.log("[INVOCAR] geração de token com userID " + user.iduser)
            try {
                const token = await JWT.sign({userID: user.iduser}, "Rasbet", {algorithm: 'HS256', noTimestamp: true, expiresIn: '1h' })
                console.log("[INVOCAR] return token with " + token)
                return token
            }catch(err){
                console.log("[INVOCAR] throw Error(erro na geração do token)")
                throw Error("Erro na geração do token")
            }
        }else{
            throw Error("Senha incorreta")
        }
    }

    async editUser(username,email,nif,iban,birthday){
        console.log("[INVOCAR] userDAO.setUserData()")
        await this.userDAO.setUserData(username,email,nif,iban,birthday)
    }
}

module.exports = UserLNFacade
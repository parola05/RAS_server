var BetDAO = require('./BetDAO')
var BuletinDAO = require('./BuletinDAO')
var UserDAO = require('../user_subsystem/UserDAO')
var TransactionDAO = require('../user_subsystem/TransacaoDAO')
var EventDAO = require('../event_subsystem/EventDAO')
var CollectiveSportOpponentsDAO = require('../event_subsystem/CollectiveSportOpponentsDAO')
var DualSportOpponentsDAO = require('../event_subsystem/DualSportOpponentsDAO')
var SportDAO = require('../event_subsystem/SportDAO')

class BetLNFacade {
    betDAO = null 
    buletinDAO = null
    userDAO = null 
    eventDAO = null
    collectiveSportOpponentsDAO = null
    dualSportOpponentsDAO = null
    sportDAO = null
    transactionDAO = null

    constructor(){
        this.betDAO = new BetDAO()
        this.buletinDAO = new BuletinDAO()
        this.userDAO = new UserDAO()
        this.transacaoDAO = new TransactionDAO(this.userDAO)
        this.eventDAO = new EventDAO()
        this.collectiveSportOpponentsDAO = new CollectiveSportOpponentsDAO()
        this.dualSportOpponentsDAO = new DualSportOpponentsDAO()
        this.sportDAO = new SportDAO()
    }

    async addBuletin(amount,gain,type,userID,bets){
        console.log("[INVOCAR] this.buletinDAO.addBuletin")
        const buletinID = await this.buletinDAO.addBuletin(amount,gain,type,userID)
        console.log("[INVOCAR] this.betDAO.addBetsFromBuletin")
        await this.betDAO.addBetsFromBuletin(bets,buletinID,type)
        console.log("[INVOCAR] this.userDAO.getUserByID")
        var userBalance =  (await this.userDAO.getUserByID(userID)).balance 
        console.log("[INVOCAR] this.userDAO.setBalance")
        await this.userDAO.setBalance(userBalance - amount,"be",amount,userID)
    }

    async getBuletinsFromUser(userID){
        console.log("[INVOCAR] this.buletinDAO.getBuletinsFromUser")
        return await this.buletinDAO.getBuletinsFromUser(userID)
    }

    async getBetsFromBuletin(buletinID){
        console.log("[INVOCAR] this.betDAO.getBetsFromBuletin")
        const betsFromBuletin = await this.betDAO.getBetsFromBuletin(buletinID)

        var coletiveBets = []
        var dualBets = []
        for (var bet of betsFromBuletin){
            var betJson = {}
            betJson["oddSelected"] = bet["odd_selected"]

            console.log("[INVOCAR] this.eventDAO.getSportFromEvent")
            const sportID = await this.eventDAO.getSportFromEvent(bet["evento"])
            console.log("[INVOCAR] this.sportDAO.getSportType")
            const sportType = await this.sportDAO.getSportType(sportID)
            console.log(sportType)

            if(sportType == "c"){
                console.log("[INVOCAR] this.collectiveSportOpponentsDAO.getTeamsFromColetiveEvent")
                betJson["evento"] = await this.collectiveSportOpponentsDAO.getTeamsFromColetiveEvent(bet["evento"])
                coletiveBets.push(betJson) 
            }else if(sportType == "d"){
                console.log("[INVOCAR] this.dualSportOpponentsDAO.getPlayersFromDualEvent")
                betJson["evento"] = await this.dualSportOpponentsDAO.getPlayersFromDualEvent(bet["evento"]) 
                dualBets.push(betJson)
            }else if(sportType == "i"){

            }
        }

        var resJson = {}
        resJson["betsColetiveSports"] = coletiveBets
        resJson["betsDualSports"] = dualBets

        return resJson
    }
}

module.exports = BetLNFacade
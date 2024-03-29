const JWT = require('jsonwebtoken')

const BetLNFacade_ = require('../business/bet_subsystem/BetLNFacade')
const BetLNFacade = new BetLNFacade_()

module.exports = {
    
    async addBuletin(req,res){
        var bets = req.body.bets
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
        var gain = req.body.gain 
        var type = req.body.type 
        var amount = req.body.amount 

        if (!bets || !user || !gain || !type || !amount ) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            console.log("[INVOCAR] BetLNFacade.addBuletin")
            await BetLNFacade.addBuletin(amount,gain,type,user.userID,bets)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async getBuletinsFromUser(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        if (!user) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            console.log("[INVOCAR] BetLNFacade.getBuletinsFromUser")
            const buletins = await BetLNFacade.getBuletinsFromUser(user.userID)
            res.status(200).json({boletins: buletins})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async getBetsFromBuletin(req,res){
        var buletinID = req.body.buletinID

        if (!buletinID) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            console.log("[INVOCAR] BetLNFacade.getBetsFromBuletin")
            const bets = await BetLNFacade.getBetsFromBuletin(buletinID)
            res.status(200).json({apostas:bets})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

     
     async addResult(req,res){
        const eventID = req.body.eventID
        const betTypeList = req.body.betTypeList 
        
        if(!eventID || !betTypeList){
            res.status(400).json({msg:"erro na requisição"})   
        }

        try{
            console.log("[INVOCAR] BetLNFacade.addResult")
            await BetLNFacade.addResult(eventID,betTypeList)
            res.status(200).json({msg:"sucesso"})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },
}
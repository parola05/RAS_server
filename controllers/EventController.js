var EventModel = require('../models/EventModel')

module.exports = {
    async setEventState(req,res){
        var state = req.body.state 
        var eventID = req.body.eventID  

        if (!state || !eventID) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await EventModel.setEventState(state,eventID)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async addSport(req,res){
        var name = req.body.name 
        var type = req.body.type  

        if (!name || !type) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await EventModel.addSport(name,type)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async addTeam(req,res){
        var name = req.body.name 

        if (!name) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await EventModel.addTeam(name)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async addPlayer(req,res){
        var name = req.body.name 

        if (!name) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await EventModel.addPlayer(name)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },
}
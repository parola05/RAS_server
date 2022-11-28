const express = require('express')
const router = express.Router()
var controller = require('../controllers/EventController')

router.post('/state',controller.setEventState)
router.post('/sport',controller.addSport)
router.post('/team',controller.addTeam)
router.post('/player',controller.addPlayer)
router.get('/team',controller.getTeams)
router.get('/player',controller.getPlayers)
router.post('/coletive',controller.addEventColetive)
router.post('/dual',controller.addEventDual)
router.post('/betType',controller.createBetType)
router.post('/eventsBySport',controller.getEventsBySport)
router.get('/sport',controller.getSports)

module.exports = router
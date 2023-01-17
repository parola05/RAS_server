const express = require('express')
const router = express.Router()
var controllerNew = require('../controller/EventController')

router.post('/state',controllerNew.setEventState) // [TESTED]
router.post('/sport',controllerNew.addSport) // [TESTED]
router.post('/team',controllerNew.addTeam) // [TESTED]
router.post('/player',controllerNew.addPlayer) // [TESTED]
router.get('/team',controllerNew.getTeams) // [TESTED]
router.get('/player',controllerNew.getPlayers) // [TESTED]
router.post('/coletive',controllerNew.addEventColetive) // [TESTED]
router.post('/dual',controllerNew.addEventDual) // [TESTED]
router.post('/betType',controllerNew.createBetType) // [TESTED]
router.post('/eventsBySport',controllerNew.getEventsBySport) // [TESTED]
router.get('/sport',controllerNew.getSports) // [TESTED]
router.post('/promotion',controllerNew.addPromotion) // [TESTED]
router.post('/betTypeStructure',controllerNew.getBetTypeStructureBySport) // [TESTED]
router.get('/eventsOthersHouses',controllerNew.getEventsOthersHouses) // [TESTED]
router.post('/follow',controllerNew.follow) // [TESTED]
router.post('/follow-cancel',controllerNew.follow_cancel) // [TESTED]
router.post('/follows',controllerNew.follows) // [TESTED]
router.post('/odds',controllerNew.updateEventOdds) // [TESTED]

module.exports = router
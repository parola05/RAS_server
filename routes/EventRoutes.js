const express = require('express')
const router = express.Router()
var controller = require('../controllers/EventController')
var passport = require('passport');
var myPassportService = require('../config/passport')(passport);

router.post('/state',passport.authenticate('jwt', { session: false }),controller.setEventState) 
router.post('/sport',passport.authenticate('jwt', { session: false }),controller.addSport)
router.post('/team',passport.authenticate('jwt', { session: false }), controller.addTeam) 
router.post('/player',passport.authenticate('jwt', { session: false }), controller.addPlayer)
router.get('/team',passport.authenticate('jwt', { session: false }),controller.getTeams) 
router.get('/player',passport.authenticate('jwt', { session: false }),controller.getPlayers) 
router.post('/coletive',passport.authenticate('jwt', { session: false }),controller.addEventColetive)
router.post('/dual',passport.authenticate('jwt', { session: false }),controller.addEventDual) 
router.post('/betType',passport.authenticate('jwt', { session: false }),controller.createBetType) 
router.post('/eventsBySport',passport.authenticate('jwt', { session: false }),controller.getEventsBySport) 
router.get('/sport',passport.authenticate('jwt', { session: false }),controller.getSports) 
router.post('/promotion',passport.authenticate('jwt', { session: false }),controller.addPromotion)
router.post('/betTypeStructure',passport.authenticate('jwt', { session: false }),controller.getBetTypeStructureBySport) 
router.get('/eventsOthersHouses',controller.getEventsOthersHouses) 
router.post('/follow',passport.authenticate('jwt', { session: false }), controller.follow) 
router.post('/follow-cancel',passport.authenticate('jwt', { session: false }), controller.follow_cancel) 
router.post('/follows',passport.authenticate('jwt', { session: false }), controller.follows) 
router.post('/odds',passport.authenticate('jwt', { session: false }), controller.updateEventOdds) 

module.exports = router
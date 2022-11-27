const express = require('express')
const router = express.Router()
var controller = require('../controllers/EventController')

router.post('/state',controller.setEventState)
router.post('/sport',controller.addSport)
router.post('/team',controller.addTeam)
router.post('/player',controller.addPlayer)

module.exports = router
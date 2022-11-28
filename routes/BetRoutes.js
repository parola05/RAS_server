const express = require('express')
const router = express.Router()
var controller = require('../controllers/BetController')

router.post('/buletin',controller.addBuletin)
router.get('/buletin',controller.getBuletinsFromUser)
router.post('/buletin-bets',controller.getBetsFromBuletin)

module.exports = router
const express = require('express')
const router = express.Router()
var controller = require('../controllers/BetController')
var controllerNew = require('../controller/BetController')

router.post('/buletin',controllerNew.addBuletin) // [TESTED]
router.get('/buletin',controllerNew.getBuletinsFromUser) // [TESTED]
router.post('/buletin-bets',controllerNew.getBetsFromBuletin) // [TESTED]

module.exports = router
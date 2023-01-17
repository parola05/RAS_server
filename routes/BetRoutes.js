const express = require('express')
const router = express.Router()
var controllerNew = require('../controller/BetController')

router.post('/buletin',controllerNew.addBuletin) // [TESTED]
router.get('/buletin',controllerNew.getBuletinsFromUser) // [TESTED]
router.post('/buletin-bets',controllerNew.getBetsFromBuletin) // [TESTED]
router.post('/addResult',controllerNew.addResult) // [TESTED]

module.exports = router
const express = require('express')
const router = express.Router()
var controller = require('../controllers/BetController')
var passport = require('passport');
var myPassportService = require('../config/passport')(passport);

router.post('/buletin',passport.authenticate('jwt', { session: false }),controller.addBuletin) 
router.get('/buletin',passport.authenticate('jwt', { session: false }),controller.getBuletinsFromUser) 
router.post('/buletin-bets',passport.authenticate('jwt', { session: false }),controller.getBetsFromBuletin) 
router.post('/addResult',passport.authenticate('jwt', { session: false }),controller.addResult) 

module.exports = router
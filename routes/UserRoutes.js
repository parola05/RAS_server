const express = require('express')
const router = express.Router()
var controller = require('../controllers/UserController')
var passport = require('passport');
var myPassportService = require('../config/passport')(passport);

router.get('/',controller.getUsers) 
router.post('/admin',passport.authenticate('jwt', { session: false }),controller.setUserAdmin) 
router.post('/spe',passport.authenticate('jwt', { session: false }),controller.setUserSpe) 
router.get('/data',passport.authenticate('jwt', { session: false }),controller.getUserData)
router.get('/transactions',passport.authenticate('jwt', { session: false }),controller.getUserTransactions)
router.get('/notifications',passport.authenticate('jwt', { session: false }),controller.getNotificationsFromUser) 
router.post('/deposit',passport.authenticate('jwt', { session: false }),controller.deposit) 
router.post('/raise',passport.authenticate('jwt', { session: false }),controller.raise) 
router.post('/register',controller.registerUser) 
router.post('/login',controller.login)
router.post('/editUser',passport.authenticate('jwt', { session: false }),controller.editUser)

module.exports = router
const express = require('express')
const router = express.Router()
var controller = require('../controllers/UserController')

router.get('/',controller.getUsers)
router.post('/admin',controller.setUserAdmin)
router.post('/spe',controller.setUserSpe)
router.get('/data',controller.getUserData)
router.get('/transactions',controller.getUserTransactions)
router.post('/promotion',controller.addPromotion)
router.get('/notifications',controller.getNotificationsFromUser)
router.post('/deposit',controller.deposit)
router.post('/raise',controller.raise)
router.post('/register',controller.registerUser)
router.post('/login',controller.login)
router.post('/editUser',controller.editUser)

module.exports = router
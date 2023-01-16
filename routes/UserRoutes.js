const express = require('express')
const router = express.Router()
var controller = require('../controller/UserController')

router.get('/',controller.getUsers) // [TESTED]
router.post('/admin',controller.setUserAdmin) // [TESTED]
router.post('/spe',controller.setUserSpe) // [TESTED]
router.get('/data',controller.getUserData) // [TESTED]
router.get('/transactions',controller.getUserTransactions) // [TESTED]
router.get('/notifications',controller.getNotificationsFromUser) // [TESTED]
router.post('/deposit',controller.deposit) // [TESTED]
router.post('/raise',controller.raise) // [TESTED]
router.post('/register',controller.registerUser) // [TESTED]
router.post('/login',controller.login) // [TESTED]
router.post('/editUser',controller.editUser)

module.exports = router
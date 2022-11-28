const express = require('express')
const router = express.Router()
var controller = require('../controllers/UserController')

router.get('/',controller.getUsers)
router.post('/admin',controller.setUserAdmin)
router.post('/spe',controller.setUserSpe)
router.get('/data',controller.getUserData)
router.get('/transactions',controller.getUserTransactions)

module.exports = router
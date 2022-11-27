const express = require('express')
const router = express.Router()
var controller = require('../controllers/UserController')

router.get('/',controller.getUsers)
router.post('/admin',controller.setUserAdmin)
router.post('/spe',controller.setUserSpe)

module.exports = router
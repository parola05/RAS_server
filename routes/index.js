const express = require('express')
const routesActions = require('../actions/routes_actions.js')
const router = express.Router()

router.put('/user',routesActions.signup)
router.post('/user',routesActions.login)

module.exports = router
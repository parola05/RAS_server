const express = require('express')
const routesActions = require('../actions/routes_actions.js')
const router = express.Router()

// TODO:
// getJogadores
// getEquipas

router.put('/user',routesActions.signup)
router.post('/user',routesActions.login)
router.put('/soccer-event',routesActions.createSoccerEvent)
router.put('/basket-event',routesActions.createBasketEvent)
router.get('/soccer-event',routesActions.getSoccerEvents)
router.put('/buletin',routesActions.createBuletin)
router.post('/transaction-deposit',routesActions.deposit)
router.post('/transaction-raise',routesActions.raise)
router.get('/transaction-user',routesActions.getUserTransactions)
router.get('/buletin-user',routesActions.getUserBuletinHistory)
router.put('/betType',routesActions.createBetType)
router.put('/sport',routesActions.createSport)
router.get('/esporte',routesActions.getSports)
router.put('/evento-coletivo',routesActions.createEventColetive)
router.get('/tipo-de-aposta-estrutura',routesActions.getBetTypeStructureBySport)
router.put('/equipa',routesActions.createTeam)
router.put('/jogador',routesActions.createPlayer)
router.post('/eventos-desporto-coletivo',routesActions.getSportEventsColetive)

module.exports = router
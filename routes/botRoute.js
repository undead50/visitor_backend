const express = require('express');

const router = express.Router();
const {
  fetchBots,
  createBot,
  deleteBot,
  updateBot,
} = require('../controller/botController');

router.get('/fetchBots', fetchBots);
router.post('/createBot', createBot);
router.delete('/deleteBot/:botId', deleteBot);
router.put('/updateBot/:botId',updateBot)

module.exports = router;
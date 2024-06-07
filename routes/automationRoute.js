const express = require('express');

const router = express.Router();
const {
  fetchAutomations,
  createAutomation,
  deleteAutomation,
  updateAutomation,
} = require('../controller/automationController');

router.get('/fetchAutomations', fetchAutomations);
router.post('/createAutomation', createAutomation);
router.delete('/deleteAutomation/:automationId', deleteAutomation);
router.put('/updateAutomation/:automationId',updateAutomation)

module.exports = router;
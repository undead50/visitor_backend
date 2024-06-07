const express = require('express');

const router = express.Router();
const {
  fetchRisks,
  createRisk,
  deleteRisk,
  updateRisk,
  calculateScore,
  initiateAssessment
} = require('../controller/riskController');

router.get('/fetchRisks', fetchRisks);
router.post('/createRisk', createRisk);
router.delete('/deleteRisk/:riskId', deleteRisk);
router.put('/updateRisk/:riskId',updateRisk);
router.put('/calculateScore/:riskId', calculateScore);
router.post('/initiateAssessment', initiateAssessment);

module.exports = router;
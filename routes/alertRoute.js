const express = require('express');

const router = express.Router();
const {
  fetchAlerts,
  createAlert,
  deleteAlert,
  updateAlert,
} = require('../controller/alertController');

router.get('/fetchAlerts', fetchAlerts);
router.post('/createAlert', createAlert);
router.delete('/deleteAlert/:alertId', deleteAlert);
router.put('/updateAlert/:alertId',updateAlert)

module.exports = router;
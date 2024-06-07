const express = require('express');

const router = express.Router();
const {
  fetchLogs,
  createLog,
  deleteLog,
  updateLog,
} = require('../controller/logController');

router.get('/fetchLogs', fetchLogs);
router.post('/createLog', createLog);
router.delete('/deleteLog/:logId', deleteLog);
router.put('/updateLog/:logId',updateLog)

module.exports = router;
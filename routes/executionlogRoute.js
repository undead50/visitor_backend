const express = require('express');

const router = express.Router();
const {
  fetchExecutionlogs,
  createExecutionlog,
  deleteExecutionlog,
  updateExecutionlog,
  fetchTaskLogById,
} = require('../controller/executionlogController');

router.get('/fetchExecutionlogs', fetchExecutionlogs);
router.post('/createExecutionlog', createExecutionlog);
router.delete('/deleteExecutionlog/:executionlogId', deleteExecutionlog);
router.put('/updateExecutionlog/:executionlogId', updateExecutionlog);
router.get('/fetchTaskLogByID', fetchTaskLogById);

module.exports = router;

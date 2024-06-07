const express = require('express');

const router = express.Router();
const {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
  getBotTask,
} = require('../controller/taskController');

router.get('/fetchTasks', fetchTasks);
router.post('/createTask', createTask);
router.delete('/deleteTask/:taskId', deleteTask);
router.put('/updateTask/:taskId', updateTask);
router.post('/getBotTask', getBotTask);

module.exports = router;

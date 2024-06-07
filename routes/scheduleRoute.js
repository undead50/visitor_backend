const express = require('express');

const router = express.Router();
const {
  fetchSchedules,
  createSchedule,
  deleteSchedule,
  updateSchedule,
} = require('../controller/scheduleController');

router.get('/fetchSchedules', fetchSchedules);
router.post('/createSchedule', createSchedule);
router.delete('/deleteSchedule/:scheduleId', deleteSchedule);
router.put('/updateSchedule/:scheduleId',updateSchedule)

module.exports = router;
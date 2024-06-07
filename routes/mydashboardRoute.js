const express = require('express');

const router = express.Router();
const {
  fetchMydashboards,
  createMydashboard,
  deleteMydashboard,
  updateMydashboard,
} = require('../controller/mydashboardController');

router.get('/fetchMydashboards', fetchMydashboards);
router.post('/createMydashboard', createMydashboard);
router.delete('/deleteMydashboard/:mydashboardId', deleteMydashboard);
router.put('/updateMydashboard/:mydashboardId',updateMydashboard)

module.exports = router;
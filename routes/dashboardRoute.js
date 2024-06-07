const express = require('express');

const router = express.Router();
const {
  fetchDashboards,
  createDashboard,
  deleteDashboard,
  updateDashboard,
} = require('../controller/dashboardController');

router.get('/fetchDashboards', fetchDashboards);
router.post('/createDashboard', createDashboard);
router.delete('/deleteDashboard/:dashboardId', deleteDashboard);
router.put('/updateDashboard/:dashboardId',updateDashboard)

module.exports = router;
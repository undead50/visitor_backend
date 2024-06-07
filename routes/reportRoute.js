const express = require('express');

const router = express.Router();
const {
  fetchReports,
  createReport,
  deleteReport,
  updateReport,
} = require('../controller/reportController');

router.get('/fetchReports', fetchReports);
router.post('/createReport', createReport);
router.delete('/deleteReport/:reportId', deleteReport);
router.put('/updateReport/:reportId',updateReport)

module.exports = router;
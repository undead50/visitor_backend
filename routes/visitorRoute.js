const express = require('express');

const router = express.Router();
const {
  fetchVisitors,
  createVisitor,
  deleteVisitor,
  updateVisitor,
} = require('../controller/visitorController');

router.get('/fetchVisitors', fetchVisitors);
router.post('/createVisitor', createVisitor);
router.delete('/deleteVisitor/:visitorId', deleteVisitor);
router.put('/updateVisitor/:visitorId',updateVisitor)

module.exports = router;
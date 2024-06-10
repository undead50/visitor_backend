const express = require('express');

const router = express.Router();
const {
  fetchVisitors,
  createVisitor,
  deleteVisitor,
  updateVisitor,
  serveFile,
  checkoutVisitor,
} = require('../controller/visitorController');

router.get('/fetchVisitors', fetchVisitors);
router.post('/createVisitor', createVisitor);
router.delete('/deleteVisitor/:visitorId', deleteVisitor);
router.put('/updateVisitor/:visitorId', updateVisitor);
router.get('/file/:fileName', serveFile);
router.put('/checkOutVisitor/:visitorId', checkoutVisitor);

module.exports = router;

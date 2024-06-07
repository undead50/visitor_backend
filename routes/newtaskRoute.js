const express = require('express');

const router = express.Router();
const {
  fetchNewtasks,
  createNewtask,
  deleteNewtask,
  updateNewtask,
} = require('../controller/newtaskController');

router.get('/fetchNewtasks', fetchNewtasks);
router.post('/createNewtask', createNewtask);
router.delete('/deleteNewtask/:newtaskId', deleteNewtask);
router.put('/updateNewtask/:newtaskId', updateNewtask);

module.exports = router;

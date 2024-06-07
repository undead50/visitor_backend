const express = require('express');

const router = express.Router();
const {
  fetchMarks,
  createMark,
  deleteMark,
  updateMark,
} = require('../controller/markController');

router.get('/fetchMarks', fetchMarks);
router.post('/createMark', createMark);
router.delete('/deleteMark/:markId', deleteMark);
router.put('/updateMark/:markId',updateMark)

module.exports = router;
const express = require('express');

const router = express.Router();
const {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controller/questionController');

router.get('/fetchQuestions', listQuestions);
router.post('/createQuestion', createQuestion);
router.put('/updateQuestion/:questionId', updateQuestion)
router.delete('/deleteQuestion/:questionId', deleteQuestion);

module.exports = router;

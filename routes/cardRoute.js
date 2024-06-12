const express = require('express');

const router = express.Router();
const {
  fetchCards,
  createCard,
  deleteCard,
  updateCard,
} = require('../controller/cardController');

router.get('/fetchCards', fetchCards);
router.post('/createCard', createCard);
router.delete('/deleteCard/:cardId', deleteCard);
router.put('/updateCard/:cardId',updateCard)

module.exports = router;
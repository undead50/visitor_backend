const express = require('express');

const router = express.Router();
const {
  fetchSignatures,
  createSignature,
  deleteSignature,
  updateSignature,
  fetchUserDetails,
} = require('../controller/signatureController');

router.get('/fetchSignatures/:accountNo', fetchSignatures);
router.post('/createSignature', createSignature);
router.delete('/deleteSignature/:signatureId', deleteSignature);
router.put('/updateSignature/:signatureId',updateSignature)
router.get('/fetchUserDetails',fetchUserDetails)

module.exports = router;
const express = require('express');

const router = express.Router();
const {
  fetchCredentials,
  createCredential,
  deleteCredential,
  updateCredential,
} = require('../controller/credentailController');

router.get('/fetchCredentails', fetchCredentials);
router.post('/createCredentail', createCredential);
router.delete('/deleteCredentail/:credentailId', deleteCredential);
router.put('/updateCredentail/:credentailId', updateCredential);

module.exports = router;

const express = require('express');

const router = express.Router();
const {
  fetchShares,
  createShare,
  deleteShare,
  updateShare,
  fetchCompanyShareDetailsbyID,
  fetchCasbaBankCustomerDetail,
  ValidateCRN
} = require('../controller/shareController');

router.get('/fetchShares', fetchShares);
router.post('/createShare', createShare);
router.delete('/deleteShare/:shareId', deleteShare);
router.put('/updateShare/:shareId',updateShare);
router.get('/fetchCompanyShareDetailsbyID/:shareId',fetchCompanyShareDetailsbyID);
router.get('/fetchCasbaBankCustomerDetail/:acctNo',fetchCasbaBankCustomerDetail)
router.post('/ValidateCRN',ValidateCRN)

module.exports = router;
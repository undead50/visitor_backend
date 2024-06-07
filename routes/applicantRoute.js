const express = require('express');

const router = express.Router();
const {
  fetchApplicants,
  createApplicant,
  deleteApplicant,
  updateApplicant,
  fetchUnverfiedApplicants,
} = require('../controller/applicantController');

router.get('/fetchApplicants', fetchApplicants);
router.post('/createApplicant', createApplicant);
router.delete('/deleteApplicant/:applicantId', deleteApplicant);
router.put('/updateApplicant/:applicantId',updateApplicant);
router.post('/fetchUnverfiedApplicants',fetchUnverfiedApplicants);

module.exports = router;
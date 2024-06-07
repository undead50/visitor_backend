const express = require('express');

const router = express.Router();
const {
  fetchBranchs,
  createBranch,
  deleteBranch,
  updateBranch,
} = require('../controller/branchController');

router.get('/fetchBranchs', fetchBranchs);
router.post('/createBranch', createBranch);
router.delete('/deleteBranch/:branchId', deleteBranch);
router.put('/updateBranch/:branchId',updateBranch)

module.exports = router;
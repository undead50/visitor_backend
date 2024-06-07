const express = require('express');

const router = express.Router();
const {
  fetchDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} = require('../controller/departmentController');

router.get('/fetchDepartments', fetchDepartments);
router.post('/createDepartment', createDepartment);
router.delete('/deleteDepartment/:departmentId', deleteDepartment);
router.put('/updateDepartment/:departmentId',updateDepartment)

module.exports = router;
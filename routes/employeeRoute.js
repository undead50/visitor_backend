const express = require('express');

const router = express.Router();
const {
  fetchEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} = require('../controller/employeeController');

router.get('/fetchEmployees', fetchEmployees);
router.post('/createEmployee', createEmployee);
router.delete('/deleteEmployee/:employeeId', deleteEmployee);
router.put('/updateEmployee/:employeeId',updateEmployee)

module.exports = router;
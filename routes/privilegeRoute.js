const express = require('express');

const router = express.Router();
const {
  fetchPrivileges,
  createPrivilege,
  deletePrivilege,
  updatePrivilege,
} = require('../controller/privilegeController');

router.get('/fetchPrivileges', fetchPrivileges);
router.post('/createPrivilege', createPrivilege);
router.delete('/deletePrivilege/:privilegeId', deletePrivilege);
router.put('/updatePrivilege/:privilegeId',updatePrivilege)

module.exports = router;
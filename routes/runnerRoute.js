const express = require('express');

const router = express.Router();
const {
  fetchRunners,
  createRunner,
  deleteRunner,
  updateRunner,
  fetchRunnerById,
} = require('../controller/runnerController');

router.get('/fetchRunners', fetchRunners);
router.post('/createRunner', createRunner);
router.delete('/deleteRunner/:runnerId', deleteRunner);
router.put('/updateRunner/:runnerId', updateRunner);
router.get('/fetchRunnerById/:remote_access', fetchRunnerById);

module.exports = router;

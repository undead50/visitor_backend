const express = require('express');

const router = express.Router();
const {
  fetchCategorys,
  createCategory,
  deleteCategory,
  updateCategory,
} = require('../controller/categoryController');

router.get('/fetchCategorys', fetchCategorys);
router.post('/createCategory', createCategory);
router.delete('/deleteCategory/:categoryId', deleteCategory);
router.put('/updateCategory/:categoryId',updateCategory)

module.exports = router;

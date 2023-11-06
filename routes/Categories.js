const express = require('express');
const { fetchCategories, createCategory } = require('../controller/Category');

const router = express.Router();
// /products already add in base path
router.get('/', fetchCategories).post('/', createCategory);

exports.router = router; 
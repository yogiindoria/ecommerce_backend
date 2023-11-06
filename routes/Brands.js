const express = require('express')
const {fetchBrand, createBrand} = require('../controller/Brand')

const router = express.Router();
// /products already add in base path
router.get('/', fetchBrand).post('/', createBrand);

exports.router = router; 
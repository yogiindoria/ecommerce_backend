const express = require('express');
const { addToCart, fetchCartByUser, deletefromCart, updateCart } = require('../controller/Cart');

const router = express.Router();
// /products already add in base path
router.post('/', addToCart)
      .get('/', fetchCartByUser)
      .patch('/:id', updateCart)
      .delete('/:id', deletefromCart)

exports.router = router; 
    

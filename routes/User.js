const express = require('express');
const { fetchLoggedInUser, updateUser } = require('../controller/User');

const router = express.Router();
// /products already add in base path
router.get('/own', fetchLoggedInUser)
      .patch('/:id', updateUser) 



exports.router = router; 
    
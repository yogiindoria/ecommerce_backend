const express = require('express');
const { createUser, loginUser, checkUser } = require('../controller/Auth');
const passport = require('passport');

const router = express.Router();
// /products already add in base path
router.post('/signup', createUser)
      .post('/login', passport.authenticate('local'), loginUser)
      .get('/check', passport.authenticate('jwt'), checkUser)

exports.router = router;    
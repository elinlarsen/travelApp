const express = require('express');
const router = express.Router();

// GET main pages

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

module.exports = router;
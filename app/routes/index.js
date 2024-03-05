const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Gas' });
});

router.get('/signup', function (req, res, next) {
    res.render('user/signup');
});

router.get('/login', function (req, res, next) {
    res.render('user/login');
});

router.post('/login', authController.login);

module.exports = router;

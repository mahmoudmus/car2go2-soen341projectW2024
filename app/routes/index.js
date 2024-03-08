const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const reservationController = require('../controllers/reservationController');

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

router.get('/logout', authController.logout);

router.get('/profile', userController.readProfile);

router.get('/myreservations', reservationController.readUserReservations);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const reservationController = require('../controllers/reservationController');
const datingController = require('../controllers/datingController');

/* GET home page. */
router.get('/', function (req, res, next) {
    let notification = req.cookies.justLoggedIn
        ? "You've successfully logged in."
        : false;
    res.clearCookie('justLoggedIn');
    res.render('index', { title: 'Gas', notification });
});

router.get('/signup', function (req, res, next) {
    res.render('user/signup');
});

router.get('/login', function (req, res, next) {
    res.render('user/login');
});

router.get('/dating', datingController.datingDashboard);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/profile', userController.readProfile);

router.get('/myreservations', reservationController.readUserReservations);

router.get('/walkin', reservationController.walkinDashboard);

module.exports = router;

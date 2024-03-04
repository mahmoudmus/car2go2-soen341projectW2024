var router = require('express').Router();

// Require controller modules.
const userController = require('../controllers/userController');

// GET users listing
router.get('/', userController.readAllUsers);

module.exports = router;

var router = require('express').Router();
var passport = require('passport');

// Require controller modules.
const userController = require('../controllers/userController');

// Create
router.post('/', userController.signUp);
router.post('/new', userController.createUser);

// Read
router.get('/', userController.readAllUsers);
router.get('/myemail', userController.readLoggedInEmail);
router.get('/:id', userController.readUser);
router.post('/checkemail', userController.findUserByEmail);

// Update
router.post('/:id/update', userController.updateProfile);
router.put('/:id', userController.updateUser);

// Delete
router.delete('/:id', userController.deleteUser);

module.exports = router;

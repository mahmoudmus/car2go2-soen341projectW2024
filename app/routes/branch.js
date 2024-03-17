const router = require('express').Router();
const branchController = require('../controllers/branchController');

router.get('', branchController.getAllBranches);

module.exports = router;

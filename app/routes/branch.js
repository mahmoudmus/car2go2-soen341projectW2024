const router = require('express').Router();
const branchController = require('../controllers/branchController');

router.get('', branchController.getAllBranches);
router.get('/:id', branchController.getBranch);

module.exports = router;

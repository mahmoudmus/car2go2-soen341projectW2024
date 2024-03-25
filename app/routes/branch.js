const router = require('express').Router();
const branchController = require('../controllers/branchController');

router.get('', branchController.getAllBranches);
router.get('/:id', branchController.getBranch);
router.get('/nearest/:postal', branchController.getNearestBranch);

module.exports = router;

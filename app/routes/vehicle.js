const router = require('express').Router();

// Require controller modules.
const vehicleController = require('../controllers/vehicleController');

// Create
router.post('/', vehicleController.createVehicle);

// Read
router.get('/', vehicleController.readAllVehicles);
router.get('/:id', vehicleController.readVehicle);

// Update
router.put('/:id', vehicleController.updateVehicle);

// Delete
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;

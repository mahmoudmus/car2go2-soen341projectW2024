const router = require('express').Router();

// Require controller modules.
const vehicleController = require('../controllers/vehicleController');

// Create
router.post('/', vehicleController.createVehicle);

// Read
router.get('/all', vehicleController.readAllVehicles);
router.get('/available', vehicleController.readAvailableVehicles);
router.get('/booking/:id', vehicleController.getBooking);
router.get('/:id', vehicleController.readVehicle);
router.get('/:id/unavailabilities', vehicleController.readUnavailabilities);
router.get('/', vehicleController.filterVehicles);

// Update
router.put('/:id', vehicleController.updateVehicle);

// Delete
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;

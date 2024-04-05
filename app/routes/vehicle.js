const router = require('express').Router();

// Require controller modules.
const vehicleController = require('../controllers/vehicleController');

// Create
router.post('/', vehicleController.createVehicle);

// Read
router.get('/', vehicleController.readAllVehicles);
router.get('/json', vehicleController.readAllVehicleObjects);
router.get('/available', vehicleController.readAvailableVehicles);
router.get('/booking/:id', vehicleController.getBooking);
router.get('/:id', vehicleController.readVehicle);
router.get('/:id/unavailabilities', vehicleController.readUnavailabilities);

// Update
router.put('/:id', vehicleController.updateVehicle);

// Delete
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;

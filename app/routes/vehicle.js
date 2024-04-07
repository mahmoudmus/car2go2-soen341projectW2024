const router = require('express').Router();

// Require controller modules.
const vehicleController = require('../controllers/vehicleController');
const datingController = require('../controllers/datingController');

// Create
router.post('/', vehicleController.createVehicle);
router.post('/liked', datingController.matchDate);

// Read
router.get('/', vehicleController.readAllVehicles);
router.get('/available', vehicleController.readAvailableVehicles);
router.get('/booking/:id', vehicleController.getBooking);
router.get('/:id', vehicleController.readVehicle);
router.get('/:id/unavailabilities', vehicleController.readUnavailabilities);

// Update
router.put('/:id', vehicleController.updateVehicle);

// Delete
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;

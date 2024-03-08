const router = require('express').Router();

// Require controller modules.
const reservationController = require('../controllers/reservationController');

// Create
router.post('/', reservationController.createReservation);

// Read
router.get('/', reservationController.readAllReservations);
router.get('/:id', reservationController.readReservation);

// Update
router.put('/:id', reservationController.updateReservation);

// Delete
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;

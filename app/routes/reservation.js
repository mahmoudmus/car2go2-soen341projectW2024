const router = require('express').Router();


// Require controller modules.
const reservationController = require('../controllers/reservationController');

// Create
router.post('/', reservationController.createReservation);

// Read
router.get('/', reservationController.readAllReservations);

// Checkin @todo delete this if mahmoud already made one
// router.get('/checkin/:id', reservationController.startCheckin);

// Return Car
router.get('/return/:id', reservationController.returnCar);

// Payment Form
router.post('/checkout', reservationController.processPayment);
router.get('/checkout', function (req, res, next) {
    try {
        //res.render('reservation/checkout', { error: 'card' });
        res.render('reservation/checkout');
    } catch (error) {
        console.log(error);
    }
});
router.get('/:id', reservationController.readReservation);

// Update
router.put('/:id', reservationController.updateReservation);

// Delete
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;

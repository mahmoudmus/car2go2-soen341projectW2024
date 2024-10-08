const router = require('express').Router();

// Require controller modules.
const reservationController = require('../controllers/reservationController');

// Create
router.post('/', reservationController.createReservation);
router.post('/booking', reservationController.bookVehicle);

// Send confirmation email
router.post('/emailconfirmation/', reservationController.emailConfirmation);
router.post('/emailbill/', reservationController.emailBill);

// Read
router.get('/', reservationController.readAllReservations);
router.get('/edit/:id', reservationController.getEditReservationPage);
router.post('/:id/bill', reservationController.generateBill);
router.post(
    '/:id/billingInformation',
    reservationController.saveBillingInformation
);

// Checkin
router.get('/checkin/:id', reservationController.startCheckin);

// Return Car
router.get('/return/:id', reservationController.returnCar);

// Payment Form
router.post('/payment', reservationController.processPayment);
router.get('/payment', function (req, res, next) {
    try {
        //res.render('reservation/payment', { error: 'card' });
        res.render('reservation/payment');
    } catch (error) {
        console.log(error);
    }
});
router.get('/:id', reservationController.readReservation);

// Update
router.put('/:id', reservationController.updateReservation);
router.patch('/:id', reservationController.updateReservationStatus);
router.post('/edit/:id', reservationController.updateBooking);

// Delete
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;

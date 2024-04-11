const request = require('supertest');
const express = require('express');
const proxyquire = require('proxyquire');
const app = express();

const reservationController = {
    createReservation: jasmine
        .createSpy('createReservation')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    readAllReservations: jasmine
        .createSpy('readAllReservations')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    readReservation: jasmine
        .createSpy('readReservation')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    updateReservation: jasmine
        .createSpy('updateReservation')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    deleteReservation: jasmine
        .createSpy('deleteReservation')
        .and.callFake(async (req, res) => res.sendStatus(200)),
};

const reservationRouter = proxyquire('../../routes/reservation', {
    '../controllers/reservationController': reservationController,
});
app.use('/reservations', reservationRouter);

describe('Reservation Routes', function () {
    it('should call createReservation on POST /reservations', async function () {
        await request(app).post('/reservations').expect(200);
        expect(reservationController.createReservation).toHaveBeenCalled();
    });

    it('should call readAllReservations on GET /reservations', async function () {
        await request(app).get('/reservations').expect(200);
        expect(reservationController.readAllReservations).toHaveBeenCalled();
    });

    it('should call readReservation on GET /reservations/:id', async function () {
        await request(app).get('/reservations/1').expect(200);
        expect(reservationController.readReservation).toHaveBeenCalled();
    });

    it('should call updateReservation on PUT /reservations/:id', async function () {
        await request(app).put('/reservations/1').expect(200);
        expect(reservationController.updateReservation).toHaveBeenCalled();
    });

    it('should call deleteReservation on DELETE /reservations/:id', async function () {
        await request(app).delete('/reservations/1').expect(200);
        expect(reservationController.deleteReservation).toHaveBeenCalled();
    });
});

const request = require('supertest');
const express = require('express');
const proxyquire = require('proxyquire');
const app = express();

const vehicleController = {
    createVehicle: jasmine
        .createSpy('createVehicle')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    readAllVehicles: jasmine
        .createSpy('readAllVehicles')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    readVehicle: jasmine
        .createSpy('readVehicle')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    updateVehicle: jasmine
        .createSpy('updateVehicle')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    deleteVehicle: jasmine
        .createSpy('deleteVehicle')
        .and.callFake(async (req, res) => res.sendStatus(200)),
};

const vehicleRouter = proxyquire('../routes/vehicle', {
    '../controllers/vehicleController': vehicleController,
});
app.use('/vehicles', vehicleRouter);

const authController = {
    login: jasmine
        .createSpy('login')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    logout: jasmine
        .createSpy('logout')
        .and.callFake(async (req, res) => res.sendStatus(200)),
};

const userController = {
    readProfile: jasmine
        .createSpy('readProfile')
        .and.callFake(async (req, res) => res.sendStatus(200)),
};

const reservationController = {
    readUserReservations: jasmine
        .createSpy('readUserReservations')
        .and.callFake(async (req, res) => res.sendStatus(200)),
};

const indexRouter = proxyquire('../routes/index', {
    '../controllers/authController': authController,
    '../controllers/userController': userController,
    '../controllers/reservationController': reservationController,
    './vehicle': vehicleRouter,
});
app.use('/', indexRouter);

describe('Index Routes', function () {
    it('should render index page on GET /', async function () {
        await request(app).get('/').expect(200);
        // Add your expectation based on the actual implementation
    });

    it('should render signup page on GET /signup', async function () {
        await request(app).get('/signup').expect(200);
        // Add your expectation based on the actual implementation
    });

    it('should render login page on GET /login', async function () {
        await request(app).get('/login').expect(200);
        // Add your expectation based on the actual implementation
    });

    it('should call login on POST /login', async function () {
        await request(app).post('/login').expect(200);
        expect(authController.login).toHaveBeenCalled();
    });

    it('should call logout on GET /logout', async function () {
        await request(app).get('/logout').expect(200);
        expect(authController.logout).toHaveBeenCalled();
    });

    it('should call readProfile on GET /profile', async function () {
        await request(app).get('/profile').expect(200);
        expect(userController.readProfile).toHaveBeenCalled();
    });

    it('should call readUserReservations on GET /myreservations', async function () {
        await request(app).get('/myreservations').expect(200);
        expect(reservationController.readUserReservations).toHaveBeenCalled();
    });
});

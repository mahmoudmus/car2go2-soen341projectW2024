const request = require('supertest');
const express = require('express');
const proxyquire = require('proxyquire');
const app = express();

const vehicleControllerMethods = [
    'createVehicle',
    'readAllVehicles',
    'readVehicle',
    'updateVehicle',
    'deleteVehicle',
];

let vehicleController = {};

for (const method of vehicleControllerMethods) {
    vehicleController[method] = jasmine
        .createSpy('method')
        .and.callFake(async (req, res) => res.sendStatus(200));
}

const vehicleRouter = proxyquire('../../routes/vehicle', {
    '../controllers/vehicleController': vehicleController,
});
app.use('/vehicles', vehicleRouter);

describe('Vehicle Routes', function () {
    it('should call createVehicle on POST /vehicles', async function () {
        await request(app).post('/vehicles').expect(200);
        expect(vehicleController.createVehicle).toHaveBeenCalled();
    });

    it('should call readAllVehicles on GET /vehicles', async function () {
        await request(app).get('/vehicles').expect(200);
        expect(vehicleController.readAllVehicles).toHaveBeenCalled();
    });

    it('should call readVehicle on GET /vehicles/:id', async function () {
        await request(app).get('/vehicles/1').expect(200);
        expect(vehicleController.readVehicle).toHaveBeenCalled();
    });

    it('should call updateVehicle on PUT /vehicles/:id', async function () {
        await request(app).put('/vehicles/1').expect(200);
        expect(vehicleController.updateVehicle).toHaveBeenCalled();
    });

    it('should call deleteVehicle on DELETE /vehicles/:id', async function () {
        await request(app).delete('/vehicles/1').expect(200);
        expect(vehicleController.deleteVehicle).toHaveBeenCalled();
    });
});

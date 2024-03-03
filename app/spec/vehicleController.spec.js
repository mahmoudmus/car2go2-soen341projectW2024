const sinon = require('sinon');
const vehicleController = require('../controllers/vehicleController');
const Vehicle = require('../models/vehicle');
const asyncHandler = require('express-async-handler');

describe('Vehicle Controller', () => {
    let req, res, next, vehicleSaveStub;

    beforeEach(() => {
        req = {
            body: {
                type: 'car',
                details: {
                    make: 'Toyota',
                    model: 'Corolla',
                    year: 2020,
                    colour: 'Red',
                    seats: 5,
                    doors: 4,
                    mileage: 50000,
                    isAutomatic: true,
                    engineType: 'Gas',
                    size: 45,
                },
                available: true,
                hourlyPrice: 20,
                branch: 'Branch1',
            },
        };

        res = {
            send: sinon.stub(),
            render: sinon.stub(),
        };

        next = sinon.stub();

        vehicleSaveStub = sinon.stub(Vehicle.prototype, 'save');
        vehicleFindStub = sinon.stub(Vehicle, 'find');
    });

    afterEach(() => {
        vehicleSaveStub.restore();
        vehicleFindStub.restore();
    });

    it('should create a new vehicle and send it as a response', async () => {
        const newVehicle = new Vehicle(req.body);
        vehicleSaveStub.resolves(newVehicle);

        await vehicleController.createVehicle(req, res, next);

        sinon.assert.calledWith(res.send, { savedVehicle: newVehicle });
        sinon.assert.notCalled(next);
    });

    it('should call next with an error if saving fails', async () => {
        const error = new Error('Database error');
        vehicleSaveStub.rejects(error);

        res = {
            status: sinon.stub().returnsThis(), // Returns the response object for chaining
            send: sinon.stub(),
        };

        await vehicleController.createVehicle(req, res, next);

        sinon.assert.calledWith(res.status, 400);
    });

    it('should fetch all vehicles and render them', async () => {
        const vehicles = [
            { type: 'car', available: true },
            { type: 'suv', available: false },
        ];
        vehicleFindStub.resolves(vehicles);

        await vehicleController.readAllVehicles(req, res, next);

        sinon.assert.calledWith(res.render, 'vehicle/list', {
            vehicleList: vehicles,
        });
        sinon.assert.notCalled(next);
    });
});

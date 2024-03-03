const sinon = require('sinon');
const vehicleController = require('../controllers/vehicleController');
const Vehicle = require('../models/vehicle');

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
            params: {
                id: 'vid',
            },
        };

        res = {
            send: sinon.stub(),
            render: sinon.stub(),
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        next = sinon.stub();

        vehicleSaveStub = sinon.stub(Vehicle.prototype, 'save');
        vehicleFindStub = sinon.stub(Vehicle, 'find');
        vehicleFindByIdStub = sinon.stub(Vehicle, 'findById');
    });

    afterEach(() => {
        vehicleSaveStub.restore();
        vehicleFindStub.restore();
        vehicleFindByIdStub.restore();
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

    it('should fetch a specific vehicle and send it as a response', async () => {
        const vehicle = {
            type: 'car',
            available: true,
            // Add other vehicle properties as needed
        };
        vehicleFindByIdStub.resolves(vehicle);

        await vehicleController.readVehicle(req, res, next);

        sinon.assert.calledWith(res.send, { vehicle });
        sinon.assert.notCalled(next);
    });

    it('should return 404 if the vehicle is not found', async () => {
        vehicleFindByIdStub.resolves(null);

        await vehicleController.readVehicle(req, res, next);

        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.json, { message: 'Vehicle not found' });
    });

    it('should return 500 if there is a server error', async () => {
        const error = new Error('Server error');
        vehicleFindByIdStub.rejects(error);

        await vehicleController.readVehicle(req, res, next);

        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { message: 'Server error' });
    });
});

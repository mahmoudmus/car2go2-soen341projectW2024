const sinon = require('sinon');
const vehicleController = require('../controllers/vehicleController');
const Vehicle = require('../models/vehicle');

describe('Vehicle Controller', () => {
    let req, res, next, vehicleSaveStub;

    beforeEach(() => {
        req = {
            query: {},
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
                dailyPrice: 20,
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
        vehicleFindByIdAndDeleteStub = sinon.stub(Vehicle, 'findByIdAndDelete');
    });

    afterEach(() => {
        vehicleSaveStub.restore();
        vehicleFindStub.restore();
        vehicleFindByIdStub.restore();
        vehicleFindByIdAndDeleteStub.restore();
    });

    it('should create a new vehicle and send it as a response', async () => {
        const newVehicle = new Vehicle(req.body);
        vehicleSaveStub.resolves(newVehicle);

        await vehicleController.createVehicle(req, res, next);

        sinon.assert.calledWith(res.render, 'vehicle/row', {
            vehicle: newVehicle,
            layout: false,
        });
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
        const vehicles = [{ type: 'car' }, { type: 'suv' }];
        vehicleFindStub.resolves(vehicles);

        await vehicleController.readAllVehicles(req, res, next);

        sinon.assert.calledWith(res.render, 'vehicle/list', {
            vehicleList: vehicles,
            branchLabel: 'All Branches',
        });
        sinon.assert.notCalled(next);
    });

    it('should fetch a specific vehicle and send it as a response', async () => {
        const vehicle = {
            type: 'car',
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

    it('should update a vehicle and send it as a response', async () => {
        const updatedVehicle = new Vehicle({
            ...req.body,
            _id: 'vid',
        });
        vehicleFindByIdStub.resolves(updatedVehicle);
        vehicleSaveStub.resolves(updatedVehicle);

        await vehicleController.updateVehicle(req, res, next);

        sinon.assert.calledWith(res.send, { updatedVehicle });
        sinon.assert.notCalled(next);
    });
});

const Reservation = require('../models/reservation');
const User = require('../models/user');
const reservationController = require('../controllers/reservationController');

describe('Reservation Controller', function () {
    it('should create a reservation and render the reservation row', async function () {
        const mockUser = { _id: 'userId', email: 'user@example.com', type: 'admin' };
        spyOn(User, 'findOne').and.returnValue(Promise.resolve(mockUser));
        spyOn(Reservation.prototype, 'save').and.returnValue(Promise.resolve({
            _id: 'reservationId',
            user: mockUser._id,
            vehicle: 'vehicleId',
            startDate: '2022-01-01',
            endDate: '2022-01-07',
        }));
        spyOn(Reservation, 'populate').and.returnValue(Promise.resolve({
            user: mockUser,
            vehicle: { _id: 'vehicleId', name: 'Vehicle Name' },
        }));

        const req = { 
            user: mockUser,
            body: {
                email: mockUser.email,
                vehicleId: 'vehicleId',
                startDate: '2022-01-01',
                endDate: '2022-01-07'
            }
        };
        const res = {
            render: jasmine.createSpy(),
            sendStatus: jasmine.createSpy(),
            status: jasmine.createSpy().and.callFake(() => res),
            json: jasmine.createSpy(),
            send: jasmine.createSpy(),
        };

        await reservationController.createReservation(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
        expect(res.render).toHaveBeenCalledWith('reservation/row', {
            reservation: jasmine.anything(),
            layout: false,
        });
    });

    it('should fetch all reservations and render the reservation list', async function () {
        spyOn(Reservation, 'find').and.returnValue({
            populate: jasmine.createSpy('populate').and.returnValue(Promise.resolve([
                { user: 'user1', vehicle: 'vehicle1', startDate: '2022-01-01', endDate: '2022-01-07' },
                { user: 'user2', vehicle: 'vehicle2', startDate: '2022-02-01', endDate: '2022-02-07' }
            ]))
        });

        const req = { user: { type: 'admin' } };
        const res = {
            render: jasmine.createSpy(),
        };

        await reservationController.readAllReservations(req, res);

        expect(Reservation.find).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('reservation/list', {
            reservationList: jasmine.anything(),
        });
    });

    it('should retrieve a single reservation and send it', async function () {
        spyOn(Reservation, 'findById').and.returnValue(Promise.resolve({
            populate: jasmine.createSpy('populate').and.returnValue(Promise.resolve({
                user: 'user1',
                vehicle: 'vehicle1',
                startDate: '2022-01-01',
                endDate: '2022-01-07',
            }))
        }));

        const req = { params: { id: 'reservationId' } };
        const res = {
            send: jasmine.createSpy(),
            status: jasmine.createSpy().and.callFake(() => res),
            json: jasmine.createSpy(),
        };

        await reservationController.readReservation(req, res);

        expect(Reservation.findById).toHaveBeenCalledWith('reservationId');
        expect(res.send).toHaveBeenCalledWith({ reservation: jasmine.anything() });
    });

    it('should update a reservation and send the updated info', async function () {
        const mockUser = { _id: 'userId', email: 'user@example.com', type: 'admin' };
        spyOn(User, 'findOne').and.returnValue(Promise.resolve(mockUser));
        spyOn(Reservation, 'findById').and.returnValue(Promise.resolve({
            save: jasmine.createSpy('save').and.returnValue(Promise.resolve()),
            populate: jasmine.createSpy('populate').and.returnValue(Promise.resolve())
        }));

        const req = { 
            user: mockUser,
            params: { id: 'reservationId' },
            body: {
                email: mockUser.email,
                vehicleId: 'newVehicleId',
                startDate: '2022-01-08',
                endDate: '2022-01-14'
            }
        };
        const res = {
            send: jasmine.createSpy(),
            status: jasmine.createSpy().and.callFake(() => res),
            json: jasmine.createSpy(),
        };

        await reservationController.updateReservation(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
        expect(Reservation.findById).toHaveBeenCalledWith('reservationId');
        expect(res.send).toHaveBeenCalledWith({ reservation: jasmine.anything() });
    });

    it('should delete a reservation and send a success message', async function () {
        spyOn(Reservation, 'findByIdAndDelete').and.returnValue(Promise.resolve(true));

        const req = { params: { id: 'reservationId' } };
        const res = {
            send: jasmine.createSpy(),
            status: jasmine.createSpy().and.callFake(() => res),
            json: jasmine.createSpy(),
        };

        await reservationController.deleteReservation(req, res);

        expect(Reservation.findByIdAndDelete).toHaveBeenCalledWith('reservationId');
        expect(res.send).toHaveBeenCalledWith({ message: 'Reservation deleted successfully.' });
    });
});

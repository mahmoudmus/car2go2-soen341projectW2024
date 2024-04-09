const Reservation = require('../../models/reservation');
const User = require('../../models/user');
const Vehicle = require('../../models/vehicle');
const reservationController = require('../../controllers/reservationController');

describe('Reservation Controller', function () {
    it('should create a reservation and render the reservation row', async function () {
        const mockUser = {
            _id: '60d5ecb4b4858e3848987654',
            email: 'user@example.com',
            type: 'admin',
        };
        spyOn(User, 'findOne').and.returnValue(Promise.resolve(mockUser));
        spyOn(reservationController, 'computeCost').and.returnValue(
            Promise.resolve(0)
        );
        spyOn(Reservation.prototype, 'save').and.returnValue(
            Promise.resolve({
                _id: '60d5ecb4b4858e3848987654',
                user: mockUser._id,
                vehicle: '60d5ecb4b4858e3848987654',
                startDate: '2022-01-01',
                endDate: '2022-01-07',
            })
        );
        spyOn(Reservation, 'populate').and.returnValue(
            Promise.resolve({
                user: mockUser,
                vehicle: {
                    _id: '60d5ecb4b4858e3848987654',
                    name: 'Vehicle Name',
                },
            })
        );
        spyOn(Vehicle, 'findById').and.returnValue(
            Promise.resolve({
                branch: '60d5ecb4b4858e3848987654',
            })
        );

        const req = {
            user: mockUser,
            body: {
                email: mockUser.email,
                vehicleId: '60d5ecb4b4858e3848987654',
                startDate: '2022-01-01',
                endDate: '2022-01-07',
            },
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
        const mockReservationFind = jasmine.createSpy('find').and.returnValue({
            populate: jasmine.createSpy('populate').and.returnValue({
                populate: jasmine.createSpy('populate').and.returnValue({
                    exec: jasmine.createSpy('exec').and.returnValue(
                        Promise.resolve([
                            {
                                user: 'user1',
                                vehicle: 'vehicle1',
                                startDate: '2022-01-01',
                                endDate: '2022-01-07',
                            },
                            {
                                user: 'user2',
                                vehicle: 'vehicle2',
                                startDate: '2022-02-01',
                                endDate: '2022-02-07',
                            },
                        ])
                    ),
                }),
            }),
        });
        spyOn(Reservation, 'find').and.callFake(mockReservationFind);
        const mockUser = {
            _id: '60d5ecb4b4858e3848987654',
            email: 'user@example.com',
            type: 'admin',
        };
        spyOn(User, 'findOne').and.returnValue(Promise.resolve(mockUser));

        const req = {
            user: { type: 'admin' },
            query: { email: 'test@gmail.com' },
        };
        const res = {
            render: jasmine.createSpy(),
        };

        await reservationController.readAllReservations(req, res);

        expect(Reservation.find).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('reservation/list', {
            reservationList: jasmine.any(Array),
            userEmail: 'test@gmail.com',
        });
    });

    it('should retrieve all reservations for the current user and render the reservation list', async function () {
        const mockUser = {
            _id: 'userId',
            email: 'user@example.com',
            type: 'admin',
        };
        spyOn(User, 'findById').and.returnValue(Promise.resolve(mockUser));

        const mockReservationFind = jasmine.createSpy('find').and.returnValue({
            populate: jasmine.createSpy('populate').and.returnValue({
                populate: jasmine.createSpy('populate').and.returnValue({
                    exec: jasmine.createSpy('exec').and.returnValue(
                        Promise.resolve([
                            {
                                user: mockUser,
                                vehicle: {
                                    _id: 'vehicleId1',
                                    name: 'Vehicle Name 1',
                                },
                                startDate: '2022-01-01',
                                endDate: '2022-01-07',
                            },
                            {
                                user: mockUser,
                                vehicle: {
                                    _id: 'vehicleId2',
                                    name: 'Vehicle Name 2',
                                },
                                startDate: '2022-02-01',
                                endDate: '2022-02-07',
                            },
                        ])
                    ),
                }),
            }),
        });
        spyOn(Reservation, 'find').and.callFake(mockReservationFind);

        const req = { user: mockUser };
        const res = {
            render: jasmine.createSpy(),
        };

        await reservationController.readUserReservations(req, res);

        expect(User.findById).toHaveBeenCalledWith(mockUser._id);
        expect(Reservation.find).toHaveBeenCalledWith({ user: mockUser });
        expect(res.render).toHaveBeenCalledWith('reservation/list', {
            reservationList: jasmine.any(Array),
        });
    });

    it('should update a reservation and send the updated reservation', async function () {
        const mockUser = {
            _id: 'userId',
            email: 'user@example.com',
            type: 'admin',
        };
        spyOn(User, 'findOne').and.returnValue(Promise.resolve(mockUser));

        const mockReservation = {
            _id: 'reservationId',
            user: mockUser._id,
            vehicle: 'vehicleId',
            startDate: '2022-01-01',
            endDate: '2022-01-07',
            save: jasmine.createSpy('save').and.returnValue(
                Promise.resolve({
                    _id: 'reservationId',
                    user: mockUser._id,
                    vehicle: 'newVehicleId',
                    startDate: '2022-01-02',
                    endDate: '2022-01-08',
                })
            ),
        };
        spyOn(Reservation, 'findById').and.returnValue(
            Promise.resolve(mockReservation)
        );

        spyOn(Reservation, 'populate').and.returnValue(
            Promise.resolve({
                user: mockUser,
                vehicle: { _id: 'newVehicleId', name: 'New Vehicle Name' },
            })
        );

        const req = {
            user: mockUser,
            body: {
                email: mockUser.email,
                vehicleId: 'newVehicleId',
                startDate: '2022-01-02',
                endDate: '2022-01-08',
            },
            params: {
                id: 'reservationId',
            },
        };
        const res = {
            send: jasmine.createSpy(),
            status: jasmine.createSpy().and.callFake(() => res),
            json: jasmine.createSpy(),
        };

        await reservationController.updateReservation(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(Reservation.findById).toHaveBeenCalledWith(req.params.id);
        expect(mockReservation.save).toHaveBeenCalled();
        expect(Reservation.populate).toHaveBeenCalledWith(
            jasmine.objectContaining({
                _id: 'reservationId',
                user: mockUser._id,
                vehicle: 'newVehicleId',
                startDate: '2022-01-02',
                endDate: '2022-01-08',
            }),
            ['user', 'vehicle']
        );
        expect(res.send).toHaveBeenCalledWith({
            reservation: jasmine.anything(),
        });
    });

    it('should delete a reservation and send a success message', async function () {
        spyOn(Reservation, 'findByIdAndDelete').and.returnValue(
            Promise.resolve(true)
        );

        const req = { params: { id: 'reservationId' } };
        const res = {
            send: jasmine.createSpy(),
            status: jasmine.createSpy().and.callFake(() => res),
            json: jasmine.createSpy(),
        };

        await reservationController.deleteReservation(req, res);

        expect(Reservation.findByIdAndDelete).toHaveBeenCalledWith(
            'reservationId'
        );
        expect(res.send).toHaveBeenCalledWith({
            message: 'Reservation deleted successfully.',
        });
    });
});
it('should fetch all reservations based on user email and render the reservation list', async function () {
    const mockUser = {
        _id: 'userId',
        email: 'user@example.com',
        type: 'admin',
    };
    spyOn(User, 'findOne').and.returnValue(Promise.resolve(mockUser));

    const userEmail = 'user@example.com'; // Set the user email

    const mockReservationFind = jasmine.createSpy('find').and.returnValue({
        populate: jasmine.createSpy('populate').and.returnValue({
            populate: jasmine.createSpy('populate').and.returnValue({
                exec: jasmine.createSpy('exec').and.returnValue(
                    Promise.resolve([
                        {
                            user: 'userId',
                            vehicle: 'vehicle1',
                            startDate: '2022-01-01',
                            endDate: '2022-01-07',
                        },
                        {
                            user: 'userId',
                            vehicle: 'vehicle2',
                            startDate: '2022-02-01',
                            endDate: '2022-02-07',
                        },
                    ])
                ),
            }),
        }),
    });
    spyOn(Reservation, 'find').and.callFake(mockReservationFind);

    const req = { user: { type: 'admin' }, query: { email: userEmail } }; // Set the email query parameter
    const res = {
        render: jasmine.createSpy(),
    };

    await reservationController.readAllReservations(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: userEmail });
    expect(Reservation.find).toHaveBeenCalledWith({ user: mockUser._id });
    expect(res.render).toHaveBeenCalledWith('reservation/list', {
        reservationList: jasmine.any(Array),
        userEmail: userEmail, // Verify that userEmail is passed to the view
    });
});

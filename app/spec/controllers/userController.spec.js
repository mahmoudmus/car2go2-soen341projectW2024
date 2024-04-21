const User = require('../../models/user');
const Reservation = require('../../models/reservation');
const jwt = require('jsonwebtoken');
const userController = require('../../controllers/userController');

describe('User Controller', function () {
    it('should create a new and return a jwt in a cookie', async function () {
        spyOn(User.prototype, 'save').and.returnValue(
            Promise.resolve({ _id: 'userid' })
        );
        spyOn(jwt, 'sign').and.returnValue('token');

        const req = {
            body: {
                name: 'name',
                email: 'email',
                age: 18,
                address: 'address',
                phoneNumber: '514 123 1234',
                driverLicenseNumber: '1234567890',
                hash: 'hash',
            },
        };
        const res = {
            cookie: jasmine.createSpy(),
            redirect: jasmine.createSpy(),
        };

        await userController.signUp(req, res, () => {});

        expect(User.prototype.save).toHaveBeenCalledWith();
        expect(res.cookie).toHaveBeenCalledWith('jwt', 'token', {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
            sameSite: 'strict',
            path: '/',
        });
    });

    it('should create a new user successfully', async function () {
        spyOn(User.prototype, 'save').and.returnValue(
            Promise.resolve({
                _id: 'userid',
                name: 'name',
                email: 'email',
                age: 18,
                address: 'address',
                type: 'type',
                phoneNumber: '514 123 1234',
                driverLicenseNumber: '1234567890',
                hash: 'hash',
            })
        );

        const req = {
            body: {
                name: 'name',
                email: 'email',
                age: 18,
                address: 'address',
                type: 'type',
                phoneNumber: '514 123 1234',
                driverLicenseNumber: '1234567890',
                hash: 'hash',
            },
        };
        const res = {
            render: jasmine.createSpy(),
            status: jasmine.createSpy().and.returnValue({
                json: jasmine.createSpy(),
            }),
        };

        await userController.createUser(req, res, () => {});

        expect(User.prototype.save).toHaveBeenCalledWith();
        expect(res.render).toHaveBeenCalledWith('user/row', {
            user: {
                _id: 'userid',
                name: 'name',
                email: 'email',
                age: 18,
                address: 'address',
                type: 'type',
                phoneNumber: '514 123 1234',
                driverLicenseNumber: '1234567890',
                hash: 'hash',
            },
            layout: false,
        });
    });

    it('should fetch all usernames and pass them to be rendered in the user list', async function () {
        spyOn(User, 'find').and.returnValue(
            Promise.resolve([
                { user_name: 'Azal Al-Mashta' },
                { user_name: 'Mahmoud Mustafa' },
                { user_name: 'Alex Page' },
            ])
        );

        const req = { user: { type: 'admin' } };
        const res = {
            render: jasmine.createSpy(),
        };

        await userController.readAllUsers(req, res, () => {});

        expect(User.find).toHaveBeenCalledWith(
            {},
            'name email age address type'
        );
        expect(res.render).toHaveBeenCalledWith('user/list', {
            userList: [
                { user_name: 'Azal Al-Mashta' },
                { user_name: 'Mahmoud Mustafa' },
                { user_name: 'Alex Page' },
            ],
        });
    });

    it('should render the login page if an admin is not signed in', async function () {
        const req = { user: { type: 'customer' } };
        const res = {
            render: jasmine.createSpy(),
        };

        await userController.readAllUsers(req, res, () => {});
        expect(res.render).toHaveBeenCalledWith('user/login', {
            error: 'This page is restricted.',
        });
    });

    it('should retrieve a user successfully', async function () {
        spyOn(User, 'findById').and.returnValue(
            Promise.resolve({
                _id: 'userid',
                name: 'name',
                email: 'email',
                age: 18,
                address: 'address',
                type: 'type',
                hash: 'hash',
            })
        );

        const req = {
            params: {
                id: 'userid',
            },
        };
        const res = {
            json: jasmine.createSpy(),
        };

        await userController.readUser(req, res, () => {});

        expect(User.findById).toHaveBeenCalledWith('userid');
        expect(res.json).toHaveBeenCalledWith({
            user: {
                _id: 'userid',
                name: 'name',
                email: 'email',
                age: 18,
                address: 'address',
                type: 'type',
                hash: 'hash',
            },
        });
    });

    it('should render the user profile when a user is present', async function () {
        const req = {
            user: {
                _id: 'userid',
                name: 'name',
                email: 'email',
                age: 18,
                address: 'address',
                type: 'type',
                hash: 'hash',
            },
        };
        const res = {
            render: jasmine.createSpy(),
            redirect: jasmine.createSpy(),
        };

        await userController.readProfile(req, res, () => {});

        expect(res.render).toHaveBeenCalledWith('user/profile', {
            user: req.user,
        });
        expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should redirect to login when no user is present', async function () {
        const req = {};
        const res = {
            render: jasmine.createSpy(),
            redirect: jasmine.createSpy(),
        };

        await userController.readProfile(req, res, () => {});

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(res.render).not.toHaveBeenCalled();
    });

    it('should return the user email when a user is logged in', async function () {
        const req = {
            user: {
                email: 'user@example.com',
            },
        };
        const res = {
            json: jasmine.createSpy(),
            status: jasmine.createSpy().and.returnValue({
                json: jasmine.createSpy(),
            }),
        };

        await userController.readLoggedInEmail(req, res, () => {});

        expect(res.json).toHaveBeenCalledWith({ email: 'user@example.com' });
        expect(res.status).not.toHaveBeenCalledWith(401);
    });

    it('should return a 401 status with an error message when no user is logged in', async function () {
        const req = {};
        let nestedjson = jasmine.createSpy();
        const res = {
            json: jasmine.createSpy(),
            status: jasmine.createSpy().and.returnValue({
                json: nestedjson,
            }),
        };

        await userController.readLoggedInEmail(req, res, () => {});

        expect(res.status).toHaveBeenCalledWith(401);
        expect(nestedjson).toHaveBeenCalledWith({
            message: 'You must be logged in to make a reservation.',
        });
        expect(res.json).not.toHaveBeenCalledWith({
            email: jasmine.any(String),
        });
    });

    it('should update the user profile successfully when the logged-in user matches the user being updated', async function () {
        spyOn(User, 'findById').and.returnValue(
            Promise.resolve({
                _id: 'userid',
                name: 'oldName',
                age: 18,
                email: 'email',
                address: 'oldAddress',
                save: jasmine.createSpy(),
            })
        );

        const req = {
            params: {
                id: 'userid',
            },
            user: {
                email: 'email',
            },
            body: {
                name: 'newName',
                age: 20,
                email: 'email',
                address: 'newAddress',
            },
        };
        const res = {
            redirect: jasmine.createSpy(),
            render: jasmine.createSpy(),
        };

        await userController.updateProfile(req, res, () => {});

        expect(User.findById).toHaveBeenCalledWith('userid');
        expect(res.render).not.toHaveBeenCalled();
    });

    it('should return a 401 status with an error message when the logged-in user is not an admin', async function () {
        spyOn(User, 'findById').and.returnValue(
            Promise.resolve({
                _id: 'userid',
                name: 'oldName',
                age: 18,
                email: 'email',
                address: 'oldAddress',
                type: 'user',
                hash: 'oldHash',
            })
        );

        const req = {
            params: {
                id: 'userid',
            },
            user: {
                type: 'customer',
            },
            body: {
                name: 'newName',
                age: 20,
                email: 'email',
                address: 'newAddress',
                type: 'admin',
                hash: 'newHash',
            },
        };
        const res = {
            status: jasmine.createSpy().and.returnValue({
                json: jasmine.createSpy(),
            }),
        };

        await userController.updateUser(req, res, () => {});

        expect(User.findById).toHaveBeenCalledWith('userid');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status().json).toHaveBeenCalledWith({
            message: 'You do not have admin privileges.',
        });
    });

    it('should return a 404 status with an error message when the user does not exist', async function () {
        spyOn(User, 'findByIdAndDelete').and.returnValue(Promise.resolve(null));
        spyOn(Reservation, 'deleteMany').and.returnValue(Promise.resolve(null));

        const req = {
            params: {
                id: 'nonexistentuserid',
            },
            user: {
                id: 'userid',
            },
        };
        const res = {
            status: jasmine.createSpy().and.returnValue({
                json: jasmine.createSpy(),
            }),
            clearCookie: jasmine.createSpy(),
        };

        await userController.deleteUser(req, res, () => {});

        expect(Reservation.deleteMany).toHaveBeenCalledWith({
            user: 'nonexistentuserid',
        });
        expect(User.findByIdAndDelete).toHaveBeenCalledWith(
            'nonexistentuserid'
        );
        expect(res.clearCookie).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status().json).toHaveBeenCalledWith({
            message: 'User not found.',
        });
    });
});

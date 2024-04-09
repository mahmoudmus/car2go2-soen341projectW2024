const jwt = require('jsonwebtoken');
const {
    authenticate,
    login,
    logout,
    visitSignup,
} = require('../../controllers/authController');
const User = require('../../models/user');

describe('Auth Controller', function () {
    it('should authenticate user based on JWT token', async function () {
        spyOn(jwt, 'verify').and.callFake((token, secret, callback) => {
            callback(null, { id: 'userId' }); // Simulate successful verification
        });
        spyOn(User, 'findById').and.returnValue(
            Promise.resolve({
                _id: 'userId',
                email: 'user@example.com',
                verifyPassword: jasmine.createSpy('verifyPassword'),
            })
        );

        const req = {
            cookies: { jwt: 'valid-token' },
        };
        const res = {
            locals: {},
        };
        const next = jasmine.createSpy();

        await authenticate(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(res.locals.user).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should log in user, set cookie and redirect', async function () {
        spyOn(User, 'findOne').and.returnValue(
            Promise.resolve({
                _id: 'userId',
                email: 'user@example.com',
                verifyPassword: jasmine
                    .createSpy('verifyPassword')
                    .and.returnValue(Promise.resolve(true)),
            })
        );
        spyOn(jwt, 'sign').and.returnValue('signed-jwt-token');

        const req = {
            body: { email: 'user@example.com', hash: 'hashed-password' },
        };
        const res = {
            render: jasmine.createSpy(),
            cookie: jasmine.createSpy(),
            redirect: jasmine.createSpy(),
        };

        await login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'user@example.com',
        });
        expect(res.cookie).toHaveBeenCalledWith(
            'jwt',
            'signed-jwt-token',
            jasmine.any(Object)
        );
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should log out user and redirect to login page', async function () {
        const res = {
            clearCookie: jasmine.createSpy(),
            redirect: jasmine.createSpy(),
        };

        await logout({}, res);

        expect(res.clearCookie).toHaveBeenCalledWith('jwt');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    it('should render the signup page', async function () {
        const res = {
            render: jasmine.createSpy(),
        };

        await visitSignup({}, res);

        expect(res.render).toHaveBeenCalledWith('user/signup');
    });
});

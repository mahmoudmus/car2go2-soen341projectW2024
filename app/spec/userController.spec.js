const User = require('../models/user');
const userController = require('../controllers/userController');

describe('User Controller', function () {
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
});

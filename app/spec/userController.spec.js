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

        const res = {
            render: jasmine.createSpy(),
        };

        await userController.readAllUsers({}, res, () => {});

        expect(User.find).toHaveBeenCalledWith({}, 'user_name');
        expect(res.render).toHaveBeenCalledWith('user_list', {
            user_list: [
                { user_name: 'Azal Al-Mashta' },
                { user_name: 'Mahmoud Mustafa' },
                { user_name: 'Alex Page' },
            ],
        });
    });
});

const request = require('supertest');
const express = require('express');
const proxyquire = require('proxyquire');
const app = express();

const userController = {
    signUp: jasmine
        .createSpy('signUp')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    createUser: jasmine
        .createSpy('createUser')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    readAllUsers: jasmine
        .createSpy('readAllUsers')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    readLoggedInEmail: jasmine
        .createSpy('readLoggedInEmail')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    readUser: jasmine
        .createSpy('readUser')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    updateProfile: jasmine
        .createSpy('updateProfile')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    updateUser: jasmine
        .createSpy('updateUser')
        .and.callFake(async (req, res) => res.sendStatus(200)),
    deleteUser: jasmine
        .createSpy('deleteUser')
        .and.callFake(async (req, res) => res.sendStatus(200)),
};

const userRouter = proxyquire('../routes/user', {
    '../controllers/userController': userController,
});
app.use('/users', userRouter);

describe('User Routes', function () {
    it('should call signUp on POST /users', async function () {
        await request(app).post('/users').expect(200);
        expect(userController.signUp).toHaveBeenCalled();
    });

    it('should call createUser on POST /users/new', async function () {
        await request(app).post('/users/new').expect(200);
        expect(userController.createUser).toHaveBeenCalled();
    });

    it('should call readAllUsers on GET /users', async function () {
        await request(app).get('/users').expect(200);
        expect(userController.readAllUsers).toHaveBeenCalled();
    });

    it('should call readLoggedInEmail on GET /users/myemail', async function () {
        await request(app).get('/users/myemail').expect(200);
        expect(userController.readLoggedInEmail).toHaveBeenCalled();
    });

    it('should call readUser on GET /users/:id', async function () {
        await request(app).get('/users/1').expect(200);
        expect(userController.readUser).toHaveBeenCalled();
    });

    it('should call updateProfile on POST /users/:id/update', async function () {
        await request(app).post('/users/1/update').expect(200);
        expect(userController.updateProfile).toHaveBeenCalled();
    });

    it('should call updateUser on PUT /users/:id', async function () {
        await request(app).put('/users/1').expect(200);
        expect(userController.updateUser).toHaveBeenCalled();
    });

    it('should call deleteUser on DELETE /users/:id', async function () {
        await request(app).delete('/users/1').expect(200);
        expect(userController.deleteUser).toHaveBeenCalled();
    });
});

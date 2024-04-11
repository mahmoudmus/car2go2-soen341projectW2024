const proxyquire = require('proxyquire');
let DatingProfile = jasmine.createSpy('DatingProfile').and.returnValue({
    save: jasmine.createSpy('save').and.returnValue(Promise.resolve({})),
});

const datingController = proxyquire('../../controllers/datingController', {
    '../models/datingProfile': DatingProfile,
});

describe('createDatingProfile', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            body: {
                vehicleArray: [],
                startDate: null,
                endDate: null,
                branchName: 'Montreal',
            },
        };
        mockRes = {
            send: jasmine.createSpy('send'),
        };
        mockNext = jasmine.createSpy('next');
        datingController.buildDatingProfile = jasmine
            .createSpy('buildDatingProfile')
            .and.returnValue(Promise.resolve());

        datingController.matchDate = jasmine
            .createSpy('matchDate')
            .and.returnValue(Promise.resolve([{}, 0]));
    });

    it('should calculate & return the best match vehicle & its score.', async () => {
        await datingController.createDatingProfile(mockReq, mockRes, mockNext);
        expect(mockRes.send).toHaveBeenCalledWith({
            matchedVehicle: {},
            highestScore: 0,
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});

describe('datingDashboard', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockRes = {
            render: jasmine.createSpy('render'),
        };
        mockNext = jasmine.createSpy('next');
    });

    it('should calculate & return the best match vehicle & its score.', async () => {
        await datingController.datingDashboard(mockReq, mockRes, mockNext);
        expect(mockRes.render).toHaveBeenCalledWith('dating/start');
        expect(mockNext).not.toHaveBeenCalled();
    });
});

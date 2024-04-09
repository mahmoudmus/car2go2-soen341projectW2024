const Branch = require('../../models/branch');
const {
    getAllBranches,
    getBranch,
    getNearestBranch,
} = require('../../controllers/branchController');

describe('getAllBranches', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            send: jasmine.createSpy('send'),
        };
        mockNext = jasmine.createSpy('next');

        spyOn(Branch, 'find').and.returnValue(
            Promise.resolve([
                { _id: '1', name: 'Branch 1' },
                { _id: '2', name: 'Branch 2' },
            ])
        );

        spyOn(Branch, 'findById').and.returnValue(
            Promise.resolve({ _id: '2', name: 'Branch 2' })
        );

        spyOn(Branch, 'findOne').and.returnValue(
            Promise.resolve({ _id: '2', name: 'Branch 2' })
        );
    });

    it('should fetch all branches and send them as response', async () => {
        await getAllBranches(mockReq, mockRes, mockNext);

        expect(Branch.find).toHaveBeenCalledWith({}, '');
        expect(mockRes.send).toHaveBeenCalledWith({
            branches: [
                { _id: '1', name: 'Branch 1' },
                { _id: '2', name: 'Branch 2' },
            ],
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if Branch.find fails', async () => {
        const error = new Error('Test error');
        Branch.find.and.returnValue(Promise.reject(error));

        await getAllBranches(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should return the corresponding branch to a given branch id', async () => {
        mockReq.params = { id: '2' };
        await getBranch(mockReq, mockRes, mockNext);
        expect(Branch.findById).toHaveBeenCalledWith('2');
        expect(mockRes.send).toHaveBeenCalledWith({
            branch: { _id: '2', name: 'Branch 2' },
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return the nearest branch given a string location', async () => {
        mockReq.params = { postal: 'montreal airport' };
        await getNearestBranch(mockReq, mockRes, mockNext);
        expect(mockRes.send).toHaveBeenCalledWith({
            branch: { _id: '2', name: 'Branch 2' },
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});

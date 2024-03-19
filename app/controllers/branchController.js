const Branch = require('../models/branch');
const asyncHandler = require('express-async-handler');

exports.getAllBranches = asyncHandler(async (req, res, next) => {
    const branches = await Branch.find({}, 'name');
    res.send({ branches });
});

exports.getBranch = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const branch = await Branch.findById(id);
    res.send({ branch });
});

const Branch = require('../models/branch');
const asyncHandler = require('express-async-handler');

exports.getAllBranches = asyncHandler(async (req, res, next) => {
    const branches = await Branch.find({}, 'name');
    res.send({ branches });
});

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main()
    .then(async () => {
        await deleteBranches();
        await createBranches();
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDB);
}

const Branch = require('../models/branch');

const deleteBranches = async () => {
    try {
        const result = await Branch.deleteMany({});
        console.log(`Deleted ${result.deletedCount} branches.`);
    } catch (error) {
        console.error('Error deleting branch instances:', error);
    }
};

const createBranches = async () => {
    const branches = [
        {
            name: 'Montreal Branch',
            address: '444 Lakeshore Dr Dorval QC H9S 2A6 Canada',
            location: [-73.7304953, 45.4406357],
        },
        {
            name: 'Quebec City Branch',
            address:
                "1345 Route de L'Aéroport L'Ancienne-Lorette QC G2G 1G5 Canada",
            location: [-71.3547944, 46.79004320000001],
        },
        {
            name: 'Sherbrooke Branch',
            address: '645 Rue Principale E Cookshire-Eaton QC J0B 1M0 Canada',
            location: [-71.6211059, 45.4155214],
        },
        {
            name: 'Trois-Rivières Branch',
            address: '7067 Boul des Forges Trois-Rivières QC G8Y 1Y5 Canada',
            location: [-72.6080749, 46.3710956],
        },
    ];
    try {
        for (const branch of branches) {
            await new Branch(branch).save();
            console.log(`${branch.name} created.`);
        }
    } catch (error) {
        console.error('Error creating branch:', error);
    } finally {
        mongoose.connection.close();
    }
};

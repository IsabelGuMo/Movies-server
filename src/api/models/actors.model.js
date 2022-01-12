const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let actorsSchema = new Schema(
    {
        name: {
            type: 'string',
        },
        age: {
            type: 'number',
        },
        yearsActive: {
            type: 'string',
        }
    },
    {
        collection: 'actors',
        timestamps: true,
    }
);

module.exports = mongoose.model('actor', actorsSchema);
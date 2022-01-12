const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let moviesSchema = new Schema(
    {
        name: {
            type: 'string', 
            required: true,
        },
        description: {
            type: 'string', 
            required: true,
        },
        duration: {
            type: 'string', 
            required: true,
        },
        date: {
            type: 'string', 
            required: true,
        },
        actors: [{
            type: Schema.Types.ObjectId, 
            ref: 'actor', 
            required: true,
        }]
    },    
    {
        collection: 'movies',
        timestamps: true,
    }
);

module.exports = mongoose.model('movie', moviesSchema);
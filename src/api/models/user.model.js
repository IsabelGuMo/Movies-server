const mongoose = require('mongoose');
const schema = mongoose.schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new schema(
    {
        name: { type: string },
        email: { type: string, unique: true},
        password: { type: string },
        emoji: { type: string },
    },

    {
        collection: 'users',
        timestamps: true,
    }
); 

userSchema.plugin(uniqueValidator, { message: 'Email in use'});
module.exports = mongoose.model('user', userSchema);

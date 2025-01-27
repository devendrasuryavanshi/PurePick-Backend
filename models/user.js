import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    age: {
        type: Number,
        min: 0,
        max: 120,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    password: {
        type: String,
        required: function () { return this.authType === 'Credentials'; },
    },
    authType: {
        type: String,
        required: true,
        enum: ['Google', 'Credentials']
    },
    allergies: [String],
    diseases: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model('User', userSchema);
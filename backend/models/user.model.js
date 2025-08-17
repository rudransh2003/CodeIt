import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [50, 'Email must not be longer than 50 characters']
    },
    password: {
        type: String,
        select: false, // hidden from query results
    },
    googleId: { type: String, unique: true, sparse: true }, // optional for Google users
    name: { type: String } // useful for Google displayName
});

// Only hash password if provided
userSchema.statics.hashPassword = async function (password) {
    if (!password) return null; // no hashing for Google users
    return await bcrypt.hash(password, 10);
};

userSchema.methods.isValidPassword = async function (password) {
    if (!this.password) return false; // Google user → no password
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { email: this.email, id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const User = mongoose.model('user', userSchema);
export default User;
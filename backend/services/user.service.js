import userModel from '../models/user.model.js';

// services handle the logic outside of the nodejs server
export const createUser = async ({
    email, password
}) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userModel.create({  // built-in static method on the model class (userModel)
        email,
        password: hashedPassword
    });
    return user;
}

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }  // for adding collaborators in the project
    });
    return users;
}
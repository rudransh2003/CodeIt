import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';


export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();
        delete user._doc.password;
        //ensures the password never gets sent to the client, even a hashed password should never be exposed in the response.
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const loginController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email }).select('+password');
  
      if (!user) {
        return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
      }
  
      const isMatch = await user.isValidPassword(password);
      if (!isMatch) {
        return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
      }
  
      const token = await user.generateJWT();
      delete user._doc.password;
  
      res.status(200).json({ user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: [{ msg: 'Something went wrong. Please try again later.' }] });
    }
  };
  

  export const googleLoginController = async (req, res) => {
    try {
      const token = await req.user.generateJWT();
      delete req.user._doc.password;
      const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${FRONTEND_URL}/auth/success?token=${token}`);
    } catch (err) {
      console.error("Google login failed:", err);
      const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${FRONTEND_URL}/auth/error`);
    }
  };
  

export const profileController = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
}

export const logoutController = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({
            message: 'Logged out successfully'
        });


    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {

        console.log(err)

        res.status(400).json({ error: err.message })

    }
}

export const ValidateController = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        const userId = req.user?._id;
        let user;
        if (userEmail) {
            user = await userModel.findOne({ email: userEmail }).select('-password');
        }
        console.log('User validation successful:', user.email);
        res.json({ user });
    } catch (err) {
        res.status(500).json({
            error: 'Server error during validation',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}
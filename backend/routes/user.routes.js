import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import userModel from '../models/user.model.js';

const router = Router();
router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.createUserController);

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.loginController);

router.get('/profile', authMiddleware.authUser, userController.profileController);

router.get('/logout', authMiddleware.authUser, userController.logoutController);

router.get('/all', authMiddleware.authUser, userController.getAllUsersController);


router.get('/validate', authMiddleware.authUser, async (req, res) => {
    try {
      const userEmail = req.user?.email;
      const userId = req.user?.id || req.user?._id;
      console.log('Extracted email:', userEmail);
      console.log('Extracted ID:', userId);
      let user;
      if (userEmail) {
        console.log('Attempting to find user by email:', userEmail);
        user = await userModel.findOne({ email: userEmail }).select('-password');
        console.log('User found by email:', !!user);
      }
      
      // If no user found by email, try by ID
      if (!user && userId) {
        console.log('Attempting to find user by ID:', userId);
        user = await userModel.findById(userId).select('-password');
        console.log('User found by ID:', !!user);
      }
      
      if (!user) {
        console.log('No user found with email or ID');
        return res.status(401).json({ error: 'User not found' });
      }
  
      console.log('User validation successful:', user.email);
      res.json({ user });
      
    } catch (err) {
      console.error('=== VALIDATE ROUTE ERROR ===');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Full error:', err);
      console.error('Stack trace:', err.stack);
      
      res.status(500).json({ 
        error: 'Server error during validation',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });

export default router;
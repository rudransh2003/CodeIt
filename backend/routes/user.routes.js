import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import passport from "passport";
import "../config/passport.js"; 

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
router.post('/logout', authMiddleware.authUser, userController.logoutController);
router.get('/all', authMiddleware.authUser, userController.getAllUsersController);
router.get('/validate', authMiddleware.authUser, userController.ValidateController);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const token = await req.user.generateJWT();
      delete req.user._doc.password;

      // redirect back to frontend with token in URL
      res.redirect(`http://localhost:5173/auth/success?token=${token}`);
    } catch (err) {
      res.redirect(`http://localhost:5173/auth/error`);
    }
  }
);

export default router;
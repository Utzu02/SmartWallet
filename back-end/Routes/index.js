import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/index.js';

import firebaseAuthController from '../controllers/firebase-auth-controller.js';
import PostsController from '../controllers/posts-controller.js';


// Auth routes
router.post('/api/register', firebaseAuthController.registerUser);
router.post('/api/login', firebaseAuthController.loginUser);
router.post('/api/logout', firebaseAuthController.logoutUser);
router.post('/api/reset-password', firebaseAuthController.resetPassword);

//posts routes
router.get('/api/posts', verifyToken, PostsController.getPosts);

export default router;
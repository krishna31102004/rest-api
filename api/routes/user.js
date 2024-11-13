const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');

// Public routes
router.post('/signup', UserController.user_signup);
router.post('/login', UserController.user_login);

// Authenticated routes
router.get('/profile', checkAuth, UserController.getProfile); // Profile route
router.patch('/profile', checkAuth, UserController.updatePassword); // Update password route
router.delete('/:userId', checkAuth, UserController.user_delete); // Delete user route (ensure correct usage)




module.exports = router;

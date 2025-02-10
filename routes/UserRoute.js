const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Routes for CRUD operations
router.get('/view_users', UserController.getUser); // Fetch all users
router.post('/create_users', UserController.createUser); // Create a new user
router.put('/update_users', UserController.updateUser); // Update user information
router.delete('/delete_users', UserController.deleteUser); // Delete a user

module.exports = router;

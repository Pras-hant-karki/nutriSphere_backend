const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

// Routes for CRUD operations
router.get('/view_admins', AdminController.getAdmin); // Fetch all admins
router.post('/create_admins', AdminController.createAdmin); // Create a new admin
router.put('/update_admins', AdminController.updateAdmin); // Update admin information
router.delete('/delete_admins', AdminController.deleteAdmin); // Delete an admin

module.exports = router;

const express = require('express')

const router = express.Router();

const UserController = require('../controller/UserController')

router.get('/view_users',UserController.getUser)
router.post('/create_users',UserController.createUser)

router.put('/update_users',UserController.updateUser)
router.delete('delete_users',UserController.deleteUser)

module.exports = router;
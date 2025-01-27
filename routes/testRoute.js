const express = require('express')

const router = express.Router();

const TestController = require('../controller/testController')

router.get('/view_users',TestController.getTest)
router.post('/create_users',TestController.createTest)


module.exports = router;
const express = require('express');
const { signup, login, verifyLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-login', verifyLogin);

module.exports = router;
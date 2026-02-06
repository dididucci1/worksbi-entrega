const express = require('express');
const router = express.Router();
const { login, me } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// @route   POST /api/auth/login
// @desc    Login de usuário
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Retorna usuário logado
// @access  Private
router.get('/me', protect, me);

module.exports = router;

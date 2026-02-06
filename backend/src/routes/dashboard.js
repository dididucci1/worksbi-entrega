const express = require('express');
const router = express.Router();
const { getDashboards } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

// @route   GET /api/dashboard
// @desc    Retorna dashboards do usuário logado
// @access  Private
router.get('/', protect, getDashboards);

module.exports = router;

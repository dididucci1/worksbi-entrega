const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/auth');

// Todas as rotas de usuários requerem autenticação e permissão de admin
router.use(protect);
router.use(adminOnly);

// @route   POST /api/users
// @desc    Criar novo usuário
// @access  Private/Admin
router.post('/', createUser);

// @route   GET /api/users
// @desc    Listar todos os usuários
// @access  Private/Admin
router.get('/', getUsers);

// @route   GET /api/users/:id
// @desc    Buscar usuário por ID
// @access  Private/Admin
router.get('/:id', getUserById);

// @route   PUT /api/users/:id
// @desc    Atualizar usuário
// @access  Private/Admin
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Deletar usuário
// @access  Private/Admin
router.delete('/:id', deleteUser);

module.exports = router;

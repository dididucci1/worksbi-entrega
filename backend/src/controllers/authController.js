const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userCache = require('../middlewares/cache');

// Gera JWT otimizado com dados essenciais
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, // Contém apenas userId e role para evitar consultas
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Busca usuário selecionando apenas campos necessários + password
    const user = await User.findOne({ email, isActive: true })
      .select('+password name email role dashboards');

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera token com userId e role
    const token = generateToken(user._id, user.role);

    // Prepara dados do usuário (sem senha)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      dashboards: user.dashboards
    };

    // Salva no cache
    userCache.set(`user_${user._id}`, userData);

    res.json({
      success: true,
      token,
      user: userData
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Verifica token e retorna usuário logado
exports.me = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

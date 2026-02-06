const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userCache = require('./cache');

// Middleware de autenticação otimizado
const protect = async (req, res, next) => {
  try {
    let token;

    // Verifica se o token existe no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Não autorizado, token não encontrado' });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica no cache primeiro (OTIMIZAÇÃO)
    let user = userCache.get(`user_${decoded.userId}`);

    if (!user) {
      // Se não está no cache, busca no banco (selecionando apenas campos necessários)
      user = await User.findById(decoded.userId)
        .select('_id name email role dashboards isActive')
        .lean(); // converte para objeto JS simples (mais rápido)

      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Salva no cache
      userCache.set(`user_${decoded.userId}`, user);
    }

    // Verifica se usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({ message: 'Usuário inativo' });
    }

    // Adiciona dados do usuário na requisição (direto do token e cache)
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      ...user
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(401).json({ message: 'Não autorizado' });
  }
};

// Middleware para verificar se é admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

module.exports = { protect, adminOnly };

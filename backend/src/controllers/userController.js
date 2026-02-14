const User = require('../models/User');
const userCache = require('../middlewares/cache');

// Criar usuário (apenas admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, dashboards, isActive, logo } = req.body;

    // Validação
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    // Verifica se email já existe
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Cria usuário
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      dashboards: dashboards || [],
      isActive: isActive !== undefined ? isActive : true,
      logo: logo || 'logo.png'
    });

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        dashboards: user.dashboards,
        isActive: user.isActive,
        logo: user.logo,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Listar usuários (apenas admin) - Query otimizada
exports.getUsers = async (req, res) => {
  try {
    // Busca apenas campos necessários (sem password)
    const users = await User.find()
      .select('name email role dashboards isActive logo createdAt')
      .sort({ createdAt: -1 })
      .lean(); // Converte para objeto JS puro (mais rápido)

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Buscar usuário por ID (apenas admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name email role dashboards isActive logo createdAt')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Atualizar usuário (apenas admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role, dashboards, isActive, logo } = req.body;
    const userId = req.params.id;

    // Busca usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se email já existe (se for diferente do atual)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }
    }

    // Atualiza campos
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;
    if (dashboards !== undefined) user.dashboards = dashboards;
    if (isActive !== undefined) user.isActive = isActive;
    if (logo) user.logo = logo;

    await user.save();

    // Limpa cache do usuário
    userCache.delete(`user_${userId}`);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        dashboards: user.dashboards,
        isActive: user.isActive,
        logo: user.logo
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Deletar usuário (apenas admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Previne que admin delete a si mesmo
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Você não pode deletar sua própria conta' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Limpa cache
    userCache.delete(`user_${userId}`);

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

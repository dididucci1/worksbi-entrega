require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Script para criar o primeiro usuário admin

const createInitialAdmin = async () => {
  try {
    // Conecta ao banco
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Verifica se já existe admin
    const existingAdmin = await User.findOne({ email: 'admin@worksbi.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin já existe!');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Cria o admin inicial
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@worksbi.com',
      password: '123456',
      role: 'admin',
      dashboards: [],
      isActive: true
    });

    console.log('\n✅ Admin criado com sucesso!');
    console.log('📧 Email: admin@worksbi.com');
    console.log('🔑 Senha: 123456');
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    process.exit(1);
  }
};

createInitialAdmin();

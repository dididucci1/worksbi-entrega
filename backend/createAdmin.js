require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Script para criar ou ativar/atualizar o usuário admin

const upsertAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Busca admin existente
    let admin = await User.findOne({ email: 'admin@worksbi.com' }).select('+password');

    if (admin) {
      // Atualiza e ativa admin existente
      admin.name = admin.name || 'Administrador';
      admin.role = 'admin';
      admin.isActive = true;
      admin.dashboards = admin.dashboards || [];
      // Define a senha solicitada
      admin.password = '123456';
      await admin.save();
      console.log('\n✅ Admin atualizado e ativado!');
      console.log('📧 Email: admin@worksbi.com');
      console.log('🔑 Senha redefinida: 123456');
    } else {
      // Cria novo admin
      admin = await User.create({
        name: 'Administrador',
        email: 'admin@worksbi.com',
        password: '123456',
        role: 'admin',
        dashboards: [],
        isActive: true
      });
      console.log('\n✅ Novo admin criado com sucesso!');
      console.log('📧 Email: admin@worksbi.com');
      console.log('🔑 Senha: 123456');
    }

    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao criar/atualizar admin:', error);
    process.exit(1);
  }
};

upsertAdmin();

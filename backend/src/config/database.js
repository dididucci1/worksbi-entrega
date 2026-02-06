const mongoose = require('mongoose');

// Configuração de conexão otimizada e reutilizável
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Usando conexão MongoDB existente');
    return;
  }

  try {
    const options = {
      maxPoolSize: 10, // Limita o número de conexões simultâneas
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4 // Força IPv4
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    isConnected = true;
    console.log('✅ MongoDB conectado com sucesso!');
    console.log('📊 Database:', mongoose.connection.name);

    // Event listeners para monitoramento
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão MongoDB:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

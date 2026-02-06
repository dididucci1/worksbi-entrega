require('dotenv').config();
const mongoose = require('mongoose');

// Script de teste de conexão

const testConnection = async () => {
  try {
    console.log('🔄 Testando conexão com MongoDB...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('📡 Status:', mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
    
    // Lista collections existentes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📦 Collections existentes:', collections.length);
    collections.forEach(col => console.log('  -', col.name));
    
    // Fecha conexão
    await mongoose.connection.close();
    console.log('\n✅ Teste concluído com sucesso!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Erro na conexão:');
    console.error(error.message);
    console.error('\n💡 Dicas:');
    console.error('  - Verifique se a URL do MongoDB está correta no .env');
    console.error('  - Confirme que o usuário e senha estão corretos');
    console.error('  - Verifique sua conexão com a internet');
    process.exit(1);
  }
};

testConnection();

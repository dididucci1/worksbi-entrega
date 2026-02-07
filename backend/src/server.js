require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: false,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// FRONTEND ESTÁTICO
// =======================
const frontendRoot = path.resolve(__dirname, '../../');
app.use(express.static(frontendRoot));

// =======================
// LOG DEV
// =======================
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// =======================
// ROTAS API
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// =======================
// ROOT
// =======================
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

// Health check (IMPORTANTE pro Fly)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// =======================
// 404
// =======================
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// =======================
// START SERVER (ANTES DO MONGO)
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// =======================
// MONGO (NÃO TRAVA O SERVER)
// =======================
connectDB()
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.log('⚠️ MongoDB desconectado:', err.message));

// =======================
// ERROS (NÃO DERRUBA EM PROD)
// =======================
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

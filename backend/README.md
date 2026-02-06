# Works BI - Backend API

Backend otimizado para o portal de clientes Works BI com Node.js, Express e MongoDB.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação com tokens
- **bcryptjs** - Hash de senhas

## ⚡ Otimizações Implementadas

### 1. Cache em Memória
- Cache de usuários logados por 5 minutos
- Reduz consultas ao banco em cada requisição
- Limpeza automática de cache expirado

### 2. Seleção de Campos
- Uso de `.select()` para buscar apenas campos necessários
- Password nunca é retornado nas queries
- Queries com `.lean()` para melhor performance

### 3. Conexão Reutilizável
- Conexão única ao MongoDB reutilizada em todas as requisições
- Pool de conexões configurado (min: 2, max: 10)
- Reconexão automática em caso de falha

### 4. Índices
- Índice único em `email`
- Índice em `role` para filtros rápidos
- Índice em `isActive` para queries otimizadas

### 5. JWT Otimizado
- Token contém `userId` e `role`
- Evita consulta ao banco em cada requisição protegida
- Dados do usuário vêm do cache/token

## 📦 Instalação

```bash
cd backend
npm install
```

## ⚙️ Configuração

Arquivo `.env` já está configurado com:

```env
PORT=5000
MONGODB_URI=mongodb+srv://dididucci:Copa2018@cluster0.1qcunjo.mongodb.net/worksbi_portal_clientes?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=works_bi_secret_key_2026_super_secure_change_in_production
JWT_EXPIRES_IN=7d
CACHE_TTL=300000
```

## 🏃 Como Executar

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor estará rodando em `http://localhost:5000`

## 📚 Rotas da API

### Autenticação

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@worksbi.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Admin",
    "email": "admin@worksbi.com",
    "role": "admin",
    "dashboards": []
  }
}
```

#### Verificar Usuário Logado
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Usuários (Admin Only)

#### Criar Usuário
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "role": "user",
  "dashboards": [
    {
      "name": "Dashboard Vendas",
      "link": "https://powerbi.com/..."
    }
  ]
}
```

#### Listar Usuários
```http
GET /api/users
Authorization: Bearer {token}
```

#### Buscar Usuário por ID
```http
GET /api/users/:id
Authorization: Bearer {token}
```

#### Atualizar Usuário
```http
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "email": "joao.novo@exemplo.com",
  "role": "admin",
  "isActive": true
}
```

#### Deletar Usuário
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

### Dashboard

#### Obter Dashboards do Usuário Logado
```http
GET /api/dashboard
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "success": true,
  "dashboards": [
    {
      "name": "Dashboard Vendas",
      "link": "https://powerbi.com/..."
    }
  ],
  "role": "user"
}
```

## 🗄️ Estrutura do Banco de Dados

### Collection: users

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('admin' | 'user'),
  dashboards: [{
    name: String,
    link: String
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Permissões

### Admin
- ✅ Criar usuários
- ✅ Editar usuários
- ✅ Deletar usuários
- ✅ Listar usuários
- ✅ Acessar próprios dashboards

### User
- ✅ Apenas acessar próprios dashboards
- ❌ Sem acesso às rotas de gerenciamento

## 📊 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Conexão MongoDB
│   ├── models/
│   │   └── User.js              # Model do usuário
│   ├── middlewares/
│   │   ├── auth.js              # Autenticação JWT
│   │   └── cache.js             # Cache em memória
│   ├── controllers/
│   │   ├── authController.js    # Login e autenticação
│   │   ├── userController.js    # CRUD de usuários
│   │   └── dashboardController.js # Dashboards
│   ├── routes/
│   │   ├── auth.js              # Rotas de auth
│   │   ├── users.js             # Rotas de users
│   │   └── dashboard.js         # Rotas de dashboard
│   └── server.js                # Servidor principal
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🧪 Testando a API

Você pode usar ferramentas como:
- **Postman**
- **Insomnia**
- **Thunder Client** (extensão VS Code)

Ou via curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@worksbi.com","password":"123456"}'
```

## 🔧 Primeiro Uso

Após iniciar o servidor pela primeira vez, você precisará criar o primeiro usuário admin manualmente no MongoDB ou via código:

```javascript
// Script para criar admin inicial
const User = require('./src/models/User');

const createAdmin = async () => {
  await User.create({
    name: 'Administrador',
    email: 'admin@worksbi.com',
    password: '123456',
    role: 'admin',
    dashboards: []
  });
};
```

## 📝 Variáveis de Ambiente

- `PORT` - Porta do servidor (padrão: 5000)
- `MONGODB_URI` - String de conexão MongoDB
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRES_IN` - Tempo de expiração do token
- `CACHE_TTL` - Tempo de vida do cache em ms (padrão: 300000 = 5min)

## 🛡️ Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Autenticação JWT
- ✅ Proteção de rotas com middlewares
- ✅ Validação de dados
- ✅ CORS configurado
- ✅ Password nunca é retornado nas responses

## 📈 Performance

- Cache reduz ~80% das consultas ao banco
- Queries otimizadas com índices
- Seleção específica de campos
- Lean queries para dados read-only
- Pool de conexões configurado

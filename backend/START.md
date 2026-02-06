# 🚀 GUIA RÁPIDO - Works BI Backend

## ⚡ Início Rápido (3 passos)

### 1️⃣ Instalar
```bash
cd backend
npm install
```

### 2️⃣ Criar Admin Inicial
```bash
npm run create-admin
```

**Credenciais criadas:**
- 📧 Email: `admin@worksbi.com`
- 🔑 Senha: `123456`

### 3️⃣ Iniciar Servidor
```bash
npm run dev
```

✅ Pronto! API rodando em `http://localhost:5000`

---

## 📚 Documentação Completa

- **README.md** - Documentação completa da API
- **INSTALL.md** - Guia detalhado de instalação
- **INTEGRATION.md** - Como integrar com o frontend

---

## 🧪 Testar Rapidamente

### Login via curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@worksbi.com","password":"123456"}'
```

### Ou use Postman/Insomnia com:
- **URL:** `http://localhost:5000/api/auth/login`
- **Method:** POST
- **Body:** 
```json
{
  "email": "admin@worksbi.com",
  "password": "123456"
}
```

---

## 📊 Estrutura do Banco

**Database:** `worksbi_portal_clientes`

**Collection:** `users`

**Campos:**
- name (String)
- email (String, único)
- password (String, hasheado)
- role ('admin' | 'user')
- dashboards (Array de { name, link })
- isActive (Boolean)
- createdAt (Date)

---

## 🎯 Rotas Principais

### 🔐 Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário logado

### 👥 Usuários (Admin only)
- `POST /api/users` - Criar usuário
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar por ID
- `PUT /api/users/:id` - Atualizar
- `DELETE /api/users/:id` - Deletar

### 📊 Dashboard
- `GET /api/dashboard` - Meus dashboards

---

## ⚡ Otimizações Implementadas

✅ **Cache em memória** (5 min)
✅ **Seleção de campos** específicos
✅ **Conexão reutilizável** ao MongoDB
✅ **Índices** em email, role, isActive
✅ **JWT otimizado** com userId e role
✅ **Queries lean** para performance

---

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Criar primeiro admin
npm run create-admin

# Iniciar em desenvolvimento
npm run dev

# Iniciar em produção
npm start
```

---

## 📞 Troubleshooting

### Erro: Cannot find module
```bash
npm install
```

### Erro: Connection refused
Verifique se a URL do MongoDB está correta no `.env`

### Porta em uso
Mude no `.env`: `PORT=5001`

---

## ✅ Checklist

- [ ] Node.js instalado
- [ ] `npm install` executado
- [ ] Admin criado (`npm run create-admin`)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Login testado
- [ ] Token JWT recebido

---

## 🎯 Próximo Passo

Leia o arquivo **INTEGRATION.md** para integrar o frontend com este backend!

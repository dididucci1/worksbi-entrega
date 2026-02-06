# 🚀 Guia de Instalação - Works BI Backend

## Passo 1: Instalar Node.js

Se você ainda não tem o Node.js instalado:

1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Execute o instalador
4. Verifique a instalação:

```bash
node --version
npm --version
```

## Passo 2: Instalar Dependências

Abra o terminal na pasta `backend` e execute:

```bash
cd backend
npm install
```

Isso instalará todos os pacotes necessários:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator

## Passo 3: Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado com:
- Conexão MongoDB
- Configurações JWT
- Porta do servidor

**Importante:** Em produção, altere o `JWT_SECRET`!

## Passo 4: Iniciar o Servidor

### Modo Desenvolvimento (recomendado para testes)
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

Você verá:
```
✅ MongoDB conectado com sucesso!
📊 Database: worksbi_portal_clientes
🚀 Servidor rodando na porta 5000
📍 URL: http://localhost:5000
```

## Passo 5: Criar Primeiro Usuário Admin

Como o banco está vazio, você precisa criar o primeiro admin. Tem duas opções:

### Opção 1: Via API (Temporariamente sem autenticação)

Primeiro, comente temporariamente as linhas de proteção em `src/routes/users.js`:

```javascript
// Comente estas linhas temporariamente:
// router.use(protect);
// router.use(adminOnly);
```

Depois, faça uma requisição POST:

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Administrador",
    "email": "admin@worksbi.com",
    "password": "123456",
    "role": "admin"
  }'
```

Ou use Postman/Insomnia para fazer a requisição.

**Importante:** Depois de criar o admin, descomente as linhas de proteção!

### Opção 2: Via MongoDB Compass

1. Baixe MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Conecte com a string: `mongodb+srv://dididucci:Copa2018@cluster0.1qcunjo.mongodb.net/`
3. Selecione o database `worksbi_portal_clientes`
4. Crie a collection `users`
5. Insira um documento manualmente (a senha será hasheada no próximo login)

## Passo 6: Testar a API

### Teste 1: Health Check
```bash
curl http://localhost:5000/health
```

### Teste 2: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@worksbi.com",
    "password": "123456"
  }'
```

Você receberá um token JWT. Copie-o!

### Teste 3: Listar Usuários
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔧 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Connection refused"
- Verifique se o MongoDB está acessível
- Teste a conexão no MongoDB Compass

### Erro: "Port already in use"
- Mude a porta no `.env`: `PORT=5001`
- Ou mate o processo na porta 5000

### Erro ao criar usuário
- Verifique se já existe usuário com o mesmo email
- Confirme que o banco está acessível

## 📦 Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento (auto-reload)
npm run dev

# Iniciar em produção
npm start

# Limpar cache do npm
npm cache clean --force

# Ver versão do Node
node --version
```

## ✅ Checklist de Instalação

- [ ] Node.js instalado (v16+)
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Servidor iniciado (`npm run dev`)
- [ ] MongoDB conectado (mensagem no console)
- [ ] Primeiro admin criado
- [ ] Login testado (token recebido)
- [ ] Rotas protegidas testadas

## 🎯 Próximos Passos

Depois que o backend estiver rodando:

1. Integrar o frontend com as APIs
2. Testar criação de usuários
3. Configurar dashboards Power BI
4. Testar login de usuários diferentes (admin e user)

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do console
2. Confirme conexão com MongoDB
3. Teste as rotas individualmente
4. Verifique se todas as dependências foram instaladas

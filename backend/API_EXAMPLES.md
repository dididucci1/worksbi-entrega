# Exemplos de Requisições - Works BI API

## Variáveis
```
@baseURL = http://localhost:5000/api
@token = SEU_TOKEN_AQUI
```

---

## 🔐 AUTENTICAÇÃO

### Login Admin
```http
POST {{baseURL}}/auth/login
Content-Type: application/json

{
  "email": "admin@worksbi.com",
  "password": "123456"
}
```

### Login Usuário Comum
```http
POST {{baseURL}}/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Verificar Usuário Logado
```http
GET {{baseURL}}/auth/me
Authorization: Bearer {{token}}
```

---

## 👥 USUÁRIOS (Admin Only)

### Criar Usuário
```http
POST {{baseURL}}/users
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "role": "user",
  "dashboards": [
    {
      "name": "Dashboard Vendas",
      "link": "https://app.powerbi.com/view?r=..."
    },
    {
      "name": "Dashboard Financeiro",
      "link": "https://app.powerbi.com/view?r=..."
    }
  ]
}
```

### Criar Admin
```http
POST {{baseURL}}/users
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Novo Admin",
  "email": "novoadmin@worksbi.com",
  "password": "senha123",
  "role": "admin",
  "dashboards": []
}
```

### Listar Todos os Usuários
```http
GET {{baseURL}}/users
Authorization: Bearer {{token}}
```

### Buscar Usuário por ID
```http
GET {{baseURL}}/users/COLOQUE_O_ID_AQUI
Authorization: Bearer {{token}}
```

### Atualizar Usuário
```http
PUT {{baseURL}}/users/COLOQUE_O_ID_AQUI
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "email": "joao.novo@exemple.com",
  "role": "admin",
  "dashboards": [
    {
      "name": "Dashboard Atualizado",
      "link": "https://app.powerbi.com/view?r=..."
    }
  ],
  "isActive": true
}
```

### Atualizar Apenas Senha
```http
PUT {{baseURL}}/users/COLOQUE_O_ID_AQUI
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "password": "novaSenha123"
}
```

### Desativar Usuário (Soft Delete)
```http
PUT {{baseURL}}/users/COLOQUE_O_ID_AQUI
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "isActive": false
}
```

### Deletar Usuário (Hard Delete)
```http
DELETE {{baseURL}}/users/COLOQUE_O_ID_AQUI
Authorization: Bearer {{token}}
```

---

## 📊 DASHBOARD

### Obter Meus Dashboards
```http
GET {{baseURL}}/dashboard
Authorization: Bearer {{token}}
```

---

## 🧪 TESTES

### Health Check
```http
GET http://localhost:5000/health
```

### Rota Raiz
```http
GET http://localhost:5000/
```

---

## 📝 EXEMPLOS COMPLETOS

### Fluxo Completo: Criar e Usar Usuário

#### 1. Login como Admin
```http
POST {{baseURL}}/auth/login
Content-Type: application/json

{
  "email": "admin@worksbi.com",
  "password": "123456"
}
```

**Copie o token da resposta!**

#### 2. Criar Novo Usuário
```http
POST {{baseURL}}/users
Authorization: Bearer SEU_TOKEN_DO_PASSO_1
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@exemplo.com",
  "password": "maria123",
  "role": "user",
  "dashboards": [
    {
      "name": "Dashboard Vendas",
      "link": "https://app.powerbi.com/view?r=ABC123"
    }
  ]
}
```

#### 3. Login como Novo Usuário
```http
POST {{baseURL}}/auth/login
Content-Type: application/json

{
  "email": "maria@exemplo.com",
  "password": "maria123"
}
```

#### 4. Ver Dashboards do Usuário
```http
GET {{baseURL}}/dashboard
Authorization: Bearer TOKEN_DO_USUARIO_MARIA
```

---

## 🔧 CURL Commands

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@worksbi.com","password":"123456"}'
```

### Criar Usuário
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Teste User",
    "email": "teste@exemplo.com",
    "password": "senha123",
    "role": "user",
    "dashboards": []
  }'
```

### Listar Usuários
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 💡 Dicas

1. **Sempre use Bearer Token**: Em requisições autenticadas, adicione:
   ```
   Authorization: Bearer SEU_TOKEN
   ```

2. **Admin pode tudo**: Role `admin` tem acesso a todas as rotas de usuários

3. **User só vê seus dashboards**: Role `user` só tem acesso à rota `/dashboard`

4. **Token expira**: Por padrão, expira em 7 dias. Configure em `.env`

5. **Password é hasheado**: Senhas são automaticamente criptografadas ao criar/atualizar

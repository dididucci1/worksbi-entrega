# 🚀 Como Testar o Sistema Completo - Works BI

## ✅ Backend já está rodando!

Vejo que o backend já está funcionando em `http://localhost:5000`

## 📋 Passo a Passo para Testar

### 1️⃣ Criar o Primeiro Admin

Abra um **novo terminal** (não feche o que está rodando o backend) e execute:

```bash
cd backend
npm run create-admin
```

Isso criará:
- 📧 Email: `admin@worksbi.com`
- 🔑 Senha: `123456`

### 2️⃣ Abrir o Frontend

Agora abra o arquivo `login.html` no navegador. Você pode:

**Opção A:** Clicar duas vezes no arquivo `login.html`

**Opção B:** Usar o Live Server do VS Code (recomendado):
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito em `login.html`
3. Selecione "Open with Live Server"

### 3️⃣ Fazer Login como Admin

Na tela de login:
- Email: `admin@worksbi.com`
- Senha: `123456`

Você será redirecionado para o painel administrativo!

### 4️⃣ Criar um Usuário Teste

No painel admin:
1. Clique na aba **"Usuários"**
2. Clique em **"+ Novo Usuário"**
3. Preencha:
   - Email: `teste@exemplo.com`
   - Senha: `123`
   - Tipo: **User**
   - Dashboard:
     - Nome: `Meu Dashboard`
     - Link: `https://app.powerbi.com/view?r=...` (ou qualquer URL de teste)
4. Clique em **"Criar Usuário"**

### 5️⃣ Fazer Logout e Logar como Usuário

1. Clique no ícone de **sair** (🚪) no rodapé do menu lateral
2. Na tela de login, entre com:
   - Email: `teste@exemplo.com`
   - Senha: `123`
3. Você verá apenas o(s) dashboard(s) configurados para esse usuário!

### 6️⃣ Testar Edição de Usuário

1. Faça login novamente como admin (`admin@worksbi.com` / `123456`)
2. Vá em **Usuários**
3. Clique em **"Editar"** no usuário teste
4. Adicione mais dashboards ou altere informações
5. Clique em **"Salvar Alterações"**

### 7️⃣ Testar Dashboard do Admin

1. Como admin, clique na aba **"Dashboard"**
2. Clique em **"⚙️ Configurar Dashboard"**
3. Cole um link de dashboard Power BI
4. Salve e veja o dashboard sendo exibido!

---

## 🎯 Fluxo Completo de Teste

### Como Admin:
✅ Login com admin@worksbi.com
✅ Ver lista vazia de usuários
✅ Criar novo usuário (user)
✅ Editar usuário
✅ Adicionar múltiplos dashboards ao usuário
✅ Configurar dashboard próprio do admin
✅ Deletar usuário

### Como Usuário:
✅ Login com usuário criado
✅ Ver apenas dashboards atribuídos
✅ Clicar em um dashboard para visualizar
✅ Voltar para lista de dashboards
✅ Fazer logout

---

## 🔧 Troubleshooting

### Erro: "Failed to fetch" ou "Network Error"
**Causa:** Backend não está rodando ou CORS está bloqueando

**Solução:**
1. Verifique se o backend está rodando na porta 5000
2. Verifique no console do navegador (F12) se há erros CORS
3. Se tiver erro CORS e estiver usando Live Server, certifique-se que está na porta padrão

### Erro: "Token inválido" ou "Não autorizado"
**Causa:** Token JWT expirou ou não existe

**Solução:**
1. Faça logout
2. Limpe o localStorage do navegador (F12 > Application > Local Storage > Clear All)
3. Faça login novamente

### Usuários não aparecem
**Causa:** API não está respondendo ou erro de autenticação

**Solução:**
1. Abra o console do navegador (F12)
2. Veja se há erros nas chamadas à API
3. Verifique se o token está sendo enviado
4. Teste a API diretamente: `http://localhost:5000/api/users` (com token no Postman)

### Backend não conecta ao MongoDB
**Causa:** Conexão com MongoDB Atlas falhou

**Solução:**
1. Verifique sua conexão com a internet
2. Teste a conexão: `npm run test-connection`
3. Veja os logs do backend no terminal

---

## 📊 Testando com Postman/Insomnia (Opcional)

Se quiser testar a API diretamente:

### 1. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@worksbi.com",
  "password": "123456"
}
```

**Copie o token da resposta!**

### 2. Listar Usuários
```http
GET http://localhost:5000/api/users
Authorization: Bearer SEU_TOKEN_AQUI
```

### 3. Criar Usuário
```http
POST http://localhost:5000/api/users
Authorization: Bearer SEU_TOKEN_AQUI
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
    }
  ]
}
```

---

## ✅ Checklist de Funcionalidades

### Frontend + Backend Integrados:
- [x] Login com autenticação JWT
- [x] Validação de credenciais no backend
- [x] Redirecionamento baseado em role (admin/user)
- [x] Criação de usuários via API
- [x] Listagem de usuários via API
- [x] Edição de usuários via API
- [x] Exclusão de usuários via API
- [x] Dashboards carregados da API
- [x] Múltiplos dashboards por usuário
- [x] Logout com limpeza de token
- [x] Proteção de rotas (admin only)

---

## 🎉 Pronto!

Agora você tem um sistema completo de portal de clientes com:

- ✅ Backend Node.js + Express + MongoDB
- ✅ Autenticação JWT
- ✅ Cache otimizado
- ✅ Frontend integrado
- ✅ Gerenciamento de usuários
- ✅ Dashboards Power BI por usuário
- ✅ Sistema de permissões (admin/user)

**Divirta-se testando! 🚀**

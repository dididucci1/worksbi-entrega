# Integração Frontend com Backend - Works BI

## 🔗 URL Base da API

```javascript
const API_URL = 'http://localhost:5000/api';
```

## 📦 Passo 1: Criar Serviço de API

Crie o arquivo `frontend/js/api.js`:

```javascript
// Configuração base da API
const API_URL = 'http://localhost:5000/api';

// Função auxiliar para fazer requisições
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

// API de Autenticação
const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  me: async () => {
    return apiRequest('/auth/me');
  }
};

// API de Usuários
const userAPI = {
  create: async (userData) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  getAll: async () => {
    return apiRequest('/users');
  },
  
  getById: async (id) => {
    return apiRequest(`/users/${id}`);
  },
  
  update: async (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE'
    });
  }
};

// API de Dashboard
const dashboardAPI = {
  getMyDashboards: async () => {
    return apiRequest('/dashboard');
  }
};
```

## 🔐 Passo 2: Atualizar Login

Substitua o código do login em `login.html`:

```javascript
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await authAPI.login(email, password);
        
        // Salva token e dados do usuário
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        // Redireciona baseado no role
        if (response.user.role === 'admin') {
            window.location.href = 'home.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        
    } catch (error) {
        alert(error.message || 'Email ou senha incorretos!');
    }
});
```

## 👥 Passo 3: Atualizar Gerenciamento de Usuários

Em `home.html`, substitua as funções:

```javascript
// Carregar usuários do backend
async function loadUsers() {
    try {
        const response = await userAPI.getAll();
        const tbody = document.getElementById('userTableBody');
        tbody.innerHTML = '';
        
        response.users.forEach((user) => {
            const row = document.createElement('tr');
            const dashCount = user.dashboards ? user.dashboards.length : 0;
            const typeLabel = user.role === 'admin' ? 'Admin' : 'User';
            
            row.innerHTML = `
                <td>${user.email}</td>
                <td>${typeLabel}</td>
                <td>${dashCount} dashboard(s)</td>
                <td>
                    <button class="btn-edit" onclick="editUser('${user._id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteUser('${user._id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert('Erro ao carregar usuários: ' + error.message);
    }
}

// Criar usuário
document.getElementById('newUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const type = document.getElementById('userType').value;
    
    // Coletar dashboards
    const dashboardItems = document.querySelectorAll('.dashboard-item');
    const dashboards = [];
    dashboardItems.forEach(item => {
        const name = item.querySelector('.dashboard-name').value;
        const link = item.querySelector('.dashboard-link').value;
        if (name && link) {
            dashboards.push({ name, link });
        }
    });
    
    try {
        await userAPI.create({
            name: email.split('@')[0], // Usa parte do email como nome
            email,
            password,
            role: type,
            dashboards
        });
        
        closeNewUserModal();
        loadUsers();
        alert('Usuário criado com sucesso!');
        
    } catch (error) {
        alert('Erro ao criar usuário: ' + error.message);
    }
});

// Editar usuário
async function editUser(userId) {
    try {
        const response = await userAPI.getById(userId);
        const user = response.user;
        
        document.getElementById('editUserIndex').value = userId;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserPassword').value = ''; // Não preenche senha
        document.getElementById('editUserType').value = user.role;
        
        // Carregar dashboards existentes
        const editDashboardList = document.getElementById('editDashboardList');
        editDashboardList.innerHTML = '';
        
        if (user.dashboards && user.dashboards.length > 0) {
            user.dashboards.forEach(dashboard => {
                const field = document.createElement('div');
                field.className = 'dashboard-item';
                field.innerHTML = `
                    <input type="text" placeholder="Nome do dashboard" class="dashboard-name" value="${dashboard.name}" required>
                    <input type="text" placeholder="Link do dashboard Power BI" class="dashboard-link" value="${dashboard.link}" required>
                    <button type="button" class="btn-remove-dashboard" onclick="removeEditDashboard(this)">X</button>
                `;
                editDashboardList.appendChild(field);
            });
        } else {
            addEditDashboardField();
        }
        
        document.getElementById('editUserModal').classList.add('active');
        
    } catch (error) {
        alert('Erro ao carregar usuário: ' + error.message);
    }
}

// Salvar edição
document.getElementById('editUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userId = document.getElementById('editUserIndex').value;
    const email = document.getElementById('editUserEmail').value;
    const password = document.getElementById('editUserPassword').value;
    const type = document.getElementById('editUserType').value;
    
    // Coletar dashboards
    const dashboardItems = document.querySelectorAll('#editDashboardList .dashboard-item');
    const dashboards = [];
    dashboardItems.forEach(item => {
        const name = item.querySelector('.dashboard-name').value;
        const link = item.querySelector('.dashboard-link').value;
        if (name && link) {
            dashboards.push({ name, link });
        }
    });
    
    try {
        const updateData = {
            email,
            role: type,
            dashboards
        };
        
        // Só envia senha se foi preenchida
        if (password) {
            updateData.password = password;
        }
        
        await userAPI.update(userId, updateData);
        
        closeEditUserModal();
        loadUsers();
        alert('Usuário atualizado com sucesso!');
        
    } catch (error) {
        alert('Erro ao atualizar usuário: ' + error.message);
    }
});

// Deletar usuário
async function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
        await userAPI.delete(userId);
        loadUsers();
        alert('Usuário deletado com sucesso!');
        
    } catch (error) {
        alert('Erro ao deletar usuário: ' + error.message);
    }
}

// Carregar usuários ao iniciar
loadUsers();
```

## 📊 Passo 4: Atualizar Visualização de Dashboards

Em `dashboard.html`:

```javascript
async function loadUserDashboards() {
    try {
        const response = await dashboardAPI.getMyDashboards();
        
        const dashboardListView = document.getElementById('dashboardListView');
        const noDashboard = document.getElementById('noDashboard');
        
        if (response.dashboards && response.dashboards.length > 0) {
            response.dashboards.forEach(dashboard => {
                const card = document.createElement('div');
                card.className = 'dashboard-card';
                card.onclick = () => openDashboard(dashboard.link);
                card.innerHTML = `
                    <div class="dashboard-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                    </div>
                    <div class="dashboard-info">
                        <h3>${dashboard.name}</h3>
                        <p>Clique para visualizar</p>
                    </div>
                `;
                dashboardListView.appendChild(card);
            });
        } else {
            dashboardListView.style.display = 'none';
            noDashboard.style.display = 'flex';
        }
        
    } catch (error) {
        console.error('Erro ao carregar dashboards:', error);
        alert('Erro ao carregar dashboards: ' + error.message);
    }
}

// Carregar ao iniciar
loadUserDashboards();
```

## 🔄 Passo 5: Adicionar Verificação de Autenticação

Adicione no início de cada página protegida:

```javascript
// Verifica se está autenticado
async function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await authAPI.me();
        
        // Para páginas admin, verifica role
        if (window.location.pathname.includes('home.html')) {
            if (response.user.role !== 'admin') {
                alert('Acesso negado!');
                window.location.href = 'login.html';
            }
        }
        
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Executa ao carregar
checkAuth();
```

## 📝 Resumo das Mudanças

### Remover do Frontend:
- ❌ `localStorage.setItem('users', ...)` 
- ❌ `localStorage.getItem('users')`
- ❌ Lógica de validação local

### Adicionar:
- ✅ Chamadas à API REST
- ✅ Validação via JWT token
- ✅ Tratamento de erros da API
- ✅ Loading states (opcional)

## 🚀 Ordem de Implementação

1. Criar `api.js` com as funções de chamada
2. Atualizar `login.html` para usar API
3. Atualizar `home.html` para CRUD de usuários via API
4. Atualizar `dashboard.html` para carregar dashboards da API
5. Adicionar verificação de autenticação em todas as páginas
6. Testar fluxo completo

## 🧪 Como Testar

1. Inicie o backend: `npm run dev`
2. Crie o admin: `node createAdmin.js`
3. Abra o frontend no navegador
4. Faça login com: admin@worksbi.com / 123456
5. Teste criar, editar e deletar usuários
6. Teste login como usuário comum e visualizar dashboards

## ⚠️ CORS

Se tiver erro de CORS, o backend já está configurado. Se necessário, ajuste em `server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000', // ou seu domínio
  credentials: true
}));
```

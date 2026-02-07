// Configuração da API
// Em produção, Vercel fará o proxy /api -> backend (vercel.json rewrites)
// Em dev, quando servido pelo backend em localhost:5000, '/api' também funciona
const API_URL = '/api';


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

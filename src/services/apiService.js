class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for session cookies
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/user/authenticate', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User endpoints
  async getUsers() {
    return this.request('/user');
  }

  async createUser(userData) {
    return this.request('/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/user/${id}`, {
      method: 'DELETE',
    });
  }

  // Account endpoints
  async getAccounts() {
    return this.request('/account');
  }

  async createAccount(accountData) {
    return this.request('/account', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async updateAccount(id, accountData) {
    return this.request(`/account/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  }

  // Livestock endpoints
  async getLivestock() {
    return this.request('/livestock');
  }

  async createLivestock(livestockData) {
    return this.request('/livestock', {
      method: 'POST',
      body: JSON.stringify(livestockData),
    });
  }

  // Lookup data
  async getBreeds() {
    return this.request('/breed');
  }

  async getLivestockTypes() {
    return this.request('/livestocktype');
  }
}

export default new ApiService();
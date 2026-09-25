import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**Create axios instance with default config**/
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**Set the authentication token for API requests**/
export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

/**Response interceptor to handle transient cold-starts and retries**/
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Auto-retry once on transient 5xx serverless cold starts or timeout/network disconnects
    if (
      config &&
      !config._isRetry &&
      (error.response?.status >= 500 || error.code === 'ECONNABORTED' || error.message?.includes('Network Error'))
    ) {
      config._isRetry = true;
      console.warn('[API] Transient error encountered on initial request. Retrying in 700ms...', error.message);
      await new Promise((resolve) => setTimeout(resolve, 700));
      return apiClient(config);
    }
    return Promise.reject(error);
  }
);

/**API Service*/
export const api = {
  // Intake sessions
  async createIntake(title) {
    const response = await apiClient.post('/intakes', { title });
    return response.data.data;
  },

  async getIntakes() {
    const response = await apiClient.get('/intakes');
    return response.data.data;
  },

  async getIntake(id) {
    const response = await apiClient.get(`/intakes/${id}`);
    return response.data.data;
  },

  async deleteIntake(id) {
    const response = await apiClient.delete(`/intakes/${id}`);
    return response.data.data;
  },

  // Messages
  async sendMessage(intakeId, content) {
    const response = await apiClient.post(`/intakes/${intakeId}/messages`, { content });
    return response.data.data;
  },

  // State
  async updateState(intakeId, updates) {
    const response = await apiClient.patch(`/intakes/${intakeId}/state`, { updates });
    return response.data.data;
  },

  // Document (PDF Binary Blob)
  async getDocumentPDF(intakeId, download = false) {
    const response = await apiClient.get(`/intakes/${intakeId}/document`, {
      params: download ? { download: 'true' } : {},
      responseType: 'blob'
    });
    return response.data;
  },

  // Document (JSON metadata fallback)
  async getDocument(intakeId) {
    const response = await apiClient.get(`/intakes/${intakeId}/document`, {
      params: { format: 'json' }
    });
    return response.data.data;
  },

  // State history
  async getStateHistory(intakeId) {
    const response = await apiClient.get(`/intakes/${intakeId}/history`);
    return response.data.data;
  }
};

export default api;

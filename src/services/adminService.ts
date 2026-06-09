import { apiClient } from './api';

export const adminService = {
  login: async (email: string, passwordString: string) => {
    const res = await apiClient.post('/admin/auth/login', { email, password: passwordString });
    if (res.data.token) {
      localStorage.setItem('adminToken', res.data.token);
    }
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await apiClient.get('/admin/dashboard-stats');
    return res.data;
  },

  getUsers: async () => {
    const res = await apiClient.get('/admin/users');
    return res.data;
  },

  getReels: async () => {
    const res = await apiClient.get('/admin/reels');
    return res.data;
  },

  getTransactions: async () => {
    const res = await apiClient.get('/admin/transactions');
    return res.data;
  },

  getReports: async () => {
    const res = await apiClient.get('/admin/reports');
    return res.data;
  },

  getTickets: async () => {
    const res = await apiClient.get('/admin/tickets');
    return res.data;
  },

  suspendUser: async (userId: string) => {
    const res = await apiClient.post(`/admin/users/${userId}/suspend`);
    return res.data;
  },

  deleteReel: async (reelId: string) => {
    const res = await apiClient.post(`/admin/reels/${reelId}/delete`);
    return res.data;
  }
};

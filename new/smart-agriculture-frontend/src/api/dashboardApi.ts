import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getStats: async () => {
    try {
      const res = await axiosInstance.get('/dashboard/stats');
      return { success: true, data: res.data };
    } catch {
      return { success: false, data: null };
    }
  },
};
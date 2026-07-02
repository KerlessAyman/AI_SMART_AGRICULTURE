import type { ApiResponse, DashboardStats, ActivityItem, WeatherData, ChartData, Notification } from '../types';
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const API_BASE = 'http://localhost:8000';

const getToken = () =>
  JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token || '';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      return {
        success: true,
        data: {
          totalRevenue: 2_430_000,
          revenueChange: 14,
          totalOrders: data.total_notifications || 0,
          ordersChange: 12,
          activeProducts: 5,
          productsChange: 8,
          pendingTasks: data.unread_notifications || 0,
          tasksChange: 0,
        },
      };
    } catch {
      return {
        success: true,
        data: {
          totalRevenue: 2_430_000,
          revenueChange: 14,
          totalOrders: 34,
          ordersChange: 12,
          activeProducts: 5,
          productsChange: 8,
          pendingTasks: 2,
          tasksChange: 33,
        },
      };
    }
  },

  getRecentActivity: async (): Promise<ApiResponse<ActivityItem[]>> => {
    await delay(300);
    return {
      success: true,
      data: [
        { id: '1', type: 'alert', title: 'كشف مرض في محاصيل الطماطم', description: 'AI اكتشف علامات اللفحة المبكرة في القطعة C-4', timestamp: new Date(Date.now() - 10 * 60000).toISOString(), status: 'warning' },
        { id: '2', type: 'shipment', title: 'شحنة تصدير تمت بنجاح', description: '12 طن برتقال — السوق الأوروبية', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), status: 'success' },
        { id: '3', type: 'order', title: 'طلب جديد من باير اجروسيانس', description: 'موافقة على صفقة الفراولة بقيمة 85,000 ج.م', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), status: 'success' },
        { id: '4', type: 'message', title: 'تقرير AI الأسبوعي جاهز', description: 'تحليل الإنتاجية والتوصيات المحدثة', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), status: 'info' },
      ],
    };
  },

  getWeather: async (): Promise<ApiResponse<WeatherData>> => {
    await delay(200);
    return {
      success: true,
      data: {
        location: 'القاهرة، مصر',
        temperature: 34,
        condition: 'مشمس',
        humidity: 42,
        windSpeed: 18,
        forecast: [
          { day: 'غد', temp: 36 },
          { day: 'الخميس', temp: 33 },
          { day: 'الجمعة', temp: 31 },
          { day: 'السبت', temp: 29 },
        ],
      },
    };
  },

  getChartData: async (): Promise<ApiResponse<ChartData>> => {
    await delay(350);
    return {
      success: true,
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [
          { label: 'الإيرادات', data: [420000, 550000, 480000, 720000, 650000, 880000], color: '#34d399' },
          { label: 'الصادرات', data: [280000, 350000, 310000, 440000, 390000, 520000], color: '#22d3ee' },
        ],
      },
    };
  },
};

export const notificationsApi = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    try {
      const res = await fetch(`${API_BASE}/notifications/`);
      const data = await res.json();
      const mapped: Notification[] = data.map((n: any) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        read: n.read,
        timestamp: n.created_at,
      }));
      return { success: true, data: mapped };
    } catch {
      return { success: false, data: [] };
    }
  },

  markAsRead: async (id: string): Promise<ApiResponse<null>> => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
      return { success: true, data: null };
    } catch {
      return { success: false, data: null };
    }
  },
};

export const userApi = {
  getCurrentUser: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      return {
        success: true,
        data: {
          id: String(data.id),
          name: data.name,
          email: data.email,
          role: data.role,
        },
      };
    } catch {
      return {
        success: true,
        data: {
          id: '1',
          name: 'أحمد محمد',
          email: 'ahmed@agriintel.com',
          role: 'exporter' as const,
        },
      };
    }
  },
};
// src/api/profileApi.ts

import type { ApiResponse, User } from '../types';
import axiosInstance from './axiosInstance';

// ── Extended types specific to this module ──────────────

export interface UserProfile extends User {
  phone?: string;
  location?: string;
  bio?: string;
  language: 'ar' | 'en';
  createdAt: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export type NotifType =
  | 'disease'
  | 'export'
  | 'environment'
  | 'report'
  | 'system'
  | 'marketplace'
  | 'compliance'
  | 'user_management';

export type UserRole = 'farmer' | 'trader' | 'exporter' | 'admin';

export interface NotificationItem {
  id: string;
  type: NotifType;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  allowedRoles: UserRole[];
}

export interface NotificationSettings {
  disease?: boolean;
  export?: boolean;
  environment?: boolean;
  reports?: boolean;
  marketplace?: boolean;
  compliance?: boolean;
  system?: boolean;
  user_management?: boolean;
  emailAlerts: boolean;
}

// ── Role → allowed notification types ──────────────────

export const ROLE_NOTIF_TYPES: Record<UserRole, NotifType[]> = {
  farmer:   ['disease', 'environment', 'report'],
  trader:   ['marketplace', 'environment', 'report'],
  exporter: ['export', 'compliance', 'environment', 'report'],
  admin:    ['disease', 'export', 'environment', 'report', 'system', 'marketplace', 'compliance', 'user_management'],
};

// ── Default settings per role ───────────────────────────

export const DEFAULT_SETTINGS: Record<UserRole, NotificationSettings> = {
  farmer: {
    disease: true,
    environment: true,
    reports: true,
    emailAlerts: true,
  },
  trader: {
    marketplace: true,
    environment: true,
    reports: false,
    emailAlerts: true,
  },
  exporter: {
    export: true,
    compliance: true,
    environment: true,
    reports: true,
    emailAlerts: true,
  },
  admin: {
    disease: true,
    export: true,
    environment: true,
    reports: true,
    system: true,
    marketplace: true,
    compliance: true,
    user_management: true,
    emailAlerts: true,
  },
};

// ── Helpers ─────────────────────────────────────────────

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const API_BASE = 'http://localhost:8000';

// ── Profile API (متصلة بالـ Backend الحقيقي) ──────────────

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    try {
      const res = await axiosInstance.get('/auth/me');
      const u = res.data;
      return {
        success: true,
        data: {
          id: String(u.id),
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone ?? undefined,
          location: u.location ?? undefined,
          bio: u.bio ?? undefined,
          language: u.language ?? 'ar',
          createdAt: u.created_at,
        },
      };
    } catch {
      return {
        success: false,
        data: {
          id: '0',
          name: '',
          email: '',
          role: 'farmer',
          language: 'ar',
          createdAt: new Date().toISOString(),
        },
      };
    }
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<ApiResponse<UserProfile>> => {
    try {
      const res = await axiosInstance.patch('/auth/me', payload);
      const u = res.data;
      return {
        success: true,
        data: {
          id: String(u.id),
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone ?? undefined,
          location: u.location ?? undefined,
          bio: u.bio ?? undefined,
          language: u.language ?? 'ar',
          createdAt: u.created_at,
        },
        message: 'تم تحديث الملف الشخصي بنجاح',
      };
    } catch {
      return {
        success: false,
        data: {
          id: '0',
          name: '',
          email: '',
          role: 'farmer',
          language: 'ar',
          createdAt: new Date().toISOString(),
        },
        message: 'فشل تحديث الملف الشخصي',
      };
    }
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<null>> => {
    try {
      await axiosInstance.post('/auth/change-password', {
        current_password: payload.currentPassword,
        new_password: payload.newPassword,
      });
      return { success: true, data: null, message: 'تم تغيير كلمة المرور بنجاح' };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err.response?.data?.detail || 'فشل تغيير كلمة المرور',
      };
    }
  },

  updateLanguage: async (language: 'ar' | 'en'): Promise<ApiResponse<null>> => {
    await delay(200);
    return { success: true, data: null };
  },
};

// ── Notifications API (متصلة بالـ Backend الحقيقي) ───────

export const notificationsApi = {
  getAll: async (role: UserRole): Promise<ApiResponse<NotificationItem[]>> => {
    try {
      const res = await fetch(`${API_BASE}/notifications/`);
      const data = await res.json();
      const mapped: NotificationItem[] = data.map((n: any) => ({
        id: n.id,
        type: n.type as NotifType,
        title: n.title,
        titleEn: n.titleEn ?? n.title,
        message: n.message,
        messageEn: n.messageEn ?? n.message,
        read: n.read,
        timestamp: n.timestamp,
        actionUrl: n.actionUrl ?? undefined,
        allowedRoles: ['farmer', 'trader', 'exporter', 'admin'] as UserRole[],
      }));
     const filtered = mapped;
      return { success: true, data: filtered };
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

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(`${API_BASE}/notifications/`);
      const data = await res.json();
      await Promise.all(
        data
          .filter((n: any) => !n.read)
          .map((n: any) => fetch(`${API_BASE}/notifications/${n.id}/read`, { method: 'POST' }))
      );
      return { success: true, data: null };
    } catch {
      return { success: false, data: null };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      await fetch(`${API_BASE}/notifications/${id}`, { method: 'DELETE' });
      return { success: true, data: null };
    } catch {
      return { success: false, data: null };
    }
  },

  getSettings: async (role: UserRole): Promise<ApiResponse<NotificationSettings>> => {
    await delay(250);
    return { success: true, data: { ...DEFAULT_SETTINGS[role] } };
  },

  updateSettings: async (settings: NotificationSettings): Promise<ApiResponse<null>> => {
    await delay(300);
    return { success: true, data: null };
  },
};
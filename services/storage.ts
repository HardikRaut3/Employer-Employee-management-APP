import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  TaskItem,
  Announcement,
  AppNotification,
  User,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_TASKS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from './mockData';
import { DEFAULT_LOGIN_PASSWORD } from '../constants/auth';

const KEYS = {
  CURRENT_USER: '@hr_app_current_user',
  EMPLOYEES: '@hr_app_employees',
  ATTENDANCE: '@hr_app_attendance',
  LEAVES: '@hr_app_leaves',
  TASKS: '@hr_app_tasks',
  ANNOUNCEMENTS: '@hr_app_announcements',
  NOTIFICATIONS: '@hr_app_notifications',
};

export class StorageService {
  static syncSeedEmployees(employees: Employee[]): Employee[] {
    const seedIds = new Map(INITIAL_EMPLOYEES.map((employee) => [employee.id, employee]));

    return employees.map((employee) => {
      const seedEmployee = seedIds.get(employee.id);
      if (!seedEmployee) {
        return employee;
      }

      return {
        ...employee,
        name: seedEmployee.name,
        email: seedEmployee.email,
        role: seedEmployee.role,
        avatarUrl: seedEmployee.avatarUrl,
        department: seedEmployee.department,
        position: seedEmployee.position,
        employeeId: seedEmployee.employeeId,
        phone: seedEmployee.phone,
      };
    });
  }

  // Initialize default data if empty
  static async initStorage(): Promise<void> {
    try {
      const existingEmps = await AsyncStorage.getItem(KEYS.EMPLOYEES);
      if (!existingEmps) {
        await AsyncStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      } else {
        const parsedEmployees: Employee[] = JSON.parse(existingEmps);
        const syncedEmployees = StorageService.syncSeedEmployees(parsedEmployees);
        await AsyncStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(syncedEmployees));
      }

      const existingAtt = await AsyncStorage.getItem(KEYS.ATTENDANCE);
      if (!existingAtt) {
        await AsyncStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      }

      const existingLeaves = await AsyncStorage.getItem(KEYS.LEAVES);
      if (!existingLeaves) {
        await AsyncStorage.setItem(KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
      }

      const existingTasks = await AsyncStorage.getItem(KEYS.TASKS);
      if (!existingTasks) {
        await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      }

      const existingAnn = await AsyncStorage.getItem(KEYS.ANNOUNCEMENTS);
      if (!existingAnn) {
        await AsyncStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      }

      const existingNotifs = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
      if (!existingNotifs) {
        await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
    } catch (error) {
      console.error('Error initializing AsyncStorage:', error);
    }
  }

  // Active User session
  static async getCurrentUser(): Promise<User | null> {
    try {
      const json = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      return null;
    }
  }

  static async setCurrentUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Error setting user:', e);
    }
  }

  static normalizeEmployees(employees: Employee[]): Employee[] {
    return employees.map((e) => ({
      ...e,
      password: e.password || DEFAULT_LOGIN_PASSWORD,
      mustResetPassword: e.mustResetPassword ?? false,
    }));
  }

  // Employees CRUD
  static async getEmployees(): Promise<Employee[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.EMPLOYEES);
      const list: Employee[] = json ? JSON.parse(json) : INITIAL_EMPLOYEES;
      return StorageService.normalizeEmployees(list);
    } catch (e) {
      return StorageService.normalizeEmployees(INITIAL_EMPLOYEES);
    }
  }

  static async saveEmployees(employees: Employee[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error('Error saving employees:', e);
    }
  }

  // Attendance CRUD
  static async getAttendance(): Promise<AttendanceRecord[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.ATTENDANCE);
      return json ? JSON.parse(json) : INITIAL_ATTENDANCE;
    } catch (e) {
      return INITIAL_ATTENDANCE;
    }
  }

  static async saveAttendance(records: AttendanceRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving attendance:', e);
    }
  }

  // Leaves CRUD
  static async getLeaves(): Promise<LeaveRequest[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.LEAVES);
      return json ? JSON.parse(json) : INITIAL_LEAVES;
    } catch (e) {
      return INITIAL_LEAVES;
    }
  }

  static async saveLeaves(leaves: LeaveRequest[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LEAVES, JSON.stringify(leaves));
    } catch (e) {
      console.error('Error saving leaves:', e);
    }
  }

  // Tasks CRUD
  static async getTasks(): Promise<TaskItem[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.TASKS);
      return json ? JSON.parse(json) : INITIAL_TASKS;
    } catch (e) {
      return INITIAL_TASKS;
    }
  }

  static async saveTasks(tasks: TaskItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  }

  // Announcements CRUD
  static async getAnnouncements(): Promise<Announcement[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.ANNOUNCEMENTS);
      return json ? JSON.parse(json) : INITIAL_ANNOUNCEMENTS;
    } catch (e) {
      return INITIAL_ANNOUNCEMENTS;
    }
  }

  static async saveAnnouncements(announcements: Announcement[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (e) {
      console.error('Error saving announcements:', e);
    }
  }

  // Notifications CRUD
  static async getNotifications(): Promise<AppNotification[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
      return json ? JSON.parse(json) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static async saveNotifications(notifications: AppNotification[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  }

  // Reset Storage to defaults
  static async resetAllData(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      await AsyncStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      await AsyncStorage.setItem(KEYS.LEAVES, JSON.stringify(INITIAL_LEAVES));
      await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      await AsyncStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      await AsyncStorage.removeItem(KEYS.CURRENT_USER);
    } catch (e) {
      console.error('Error resetting data:', e);
    }
  }
}

// Development helper: expose a global function to reset app data from the debugger console.
// Usage (in RN remote debugger / web console):
//   await __resetAppData();
// Then reload the app.
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  try {
    const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : (typeof window !== 'undefined' ? (window as any) : {});
    g.__resetAppData = async () => {
      try {
        await StorageService.resetAllData();
        // eslint-disable-next-line no-console
        console.log('StorageService: resetAllData() completed — storage now matches INITIAL_* seeds.');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('StorageService: resetAllData() failed', e);
      }
    };
  } catch (e) {
    // ignore exposure errors in restricted runtimes
  }
}

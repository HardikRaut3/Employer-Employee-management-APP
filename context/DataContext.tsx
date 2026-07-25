import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  TaskItem,
  Announcement,
  AppNotification,
  TaskStatus,
  LeaveStatus,
} from '../types';
import { StorageService } from '../services/storage';
import { DEFAULT_LOGIN_PASSWORD } from '../constants/auth';

interface DataContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  tasks: TaskItem[];
  announcements: Announcement[];
  notifications: AppNotification[];
  refreshData: () => Promise<void>;
  
  // Attendance actions
  clockIn: (employeeId: string, employeeName: string, notes?: string) => Promise<AttendanceRecord>;
  clockOut: (employeeId: string) => Promise<AttendanceRecord | null>;
  getTodayAttendance: (employeeId: string) => AttendanceRecord | undefined;
  
  // Leave actions
  submitLeaveRequest: (
    employeeId: string,
    employeeName: string,
    leaveType: LeaveRequest['leaveType'],
    startDate: string,
    endDate: string,
    reason: string
  ) => Promise<LeaveRequest>;
  updateLeaveStatus: (leaveId: string, status: LeaveStatus, managerComment?: string) => Promise<void>;
  
  // Task actions
  createTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => Promise<TaskItem>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // Announcement actions
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<Announcement>;
  deleteAnnouncement: (id: string) => Promise<void>;

  // Notification actions
  markNotificationAsRead: (id: string) => Promise<void>;

  // Employee management (employer admin)
  addEmployee: (
    data: Omit<Employee, 'id' | 'employeeId' | 'joinDate'> & { employeeId?: string }
  ) => Promise<Employee>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deactivateEmployee: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refreshData = async () => {
    try {
      await StorageService.initStorage();
      const emps = await StorageService.getEmployees();
      const atts = await StorageService.getAttendance();
      const lves = await StorageService.getLeaves();
      const tsks = await StorageService.getTasks();
      const anns = await StorageService.getAnnouncements();
      const ntfs = await StorageService.getNotifications();

      setEmployees(emps);
      setAttendance(atts);
      setLeaves(lves);
      setTasks(tsks);
      setAnnouncements(anns);
      setNotifications(ntfs);
    } catch (e) {
      console.error('Error refreshing data context:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Attendance logic
  const getTodayAttendance = (employeeId: string): AttendanceRecord | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.find((a) => a.employeeId === employeeId && a.date === today);
  };

  const clockIn = async (employeeId: string, employeeName: string, notes?: string): Promise<AttendanceRecord> => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const clockInTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if late (after 9:15 AM)
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId,
      employeeName,
      date: today,
      clockIn: clockInTime,
      status: isLate ? 'Late' : 'Present',
      notes: notes || (isLate ? 'Late Clock In' : 'On Time'),
    };

    const updated = [newRecord, ...attendance];
    setAttendance(updated);
    await StorageService.saveAttendance(updated);
    return newRecord;
  };

  const clockOut = async (employeeId: string): Promise<AttendanceRecord | null> => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const clockOutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updatedRecord: AttendanceRecord | null = null;

    const updated = attendance.map((rec) => {
      if (rec.employeeId === employeeId && rec.date === today && !rec.clockOut) {
        // Calculate rough hours worked
        const hoursWorked = 8.0; // standard approx or exact
        updatedRecord = {
          ...rec,
          clockOut: clockOutTime,
          hoursWorked,
        };
        return updatedRecord;
      }
      return rec;
    });

    if (updatedRecord) {
      setAttendance(updated);
      await StorageService.saveAttendance(updated);
    }
    return updatedRecord;
  };

  // Leave logic
  const submitLeaveRequest = async (
    employeeId: string,
    employeeName: string,
    leaveType: LeaveRequest['leaveType'],
    startDate: string,
    endDate: string,
    reason: string
  ): Promise<LeaveRequest> => {
    const emp = employees.find((e) => e.id === employeeId);
    
    // calculate days difference
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave: LeaveRequest = {
      id: `lve_${Date.now()}`,
      employeeId,
      employeeName,
      employeeAvatar: emp?.avatarUrl,
      leaveType,
      startDate,
      endDate,
      totalDays: isNaN(totalDays) ? 1 : totalDays,
      reason,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newLeave, ...leaves];
    setLeaves(updated);
    await StorageService.saveLeaves(updated);
    return newLeave;
  };

  const updateLeaveStatus = async (
    leaveId: string,
    status: LeaveStatus,
    managerComment?: string
  ): Promise<void> => {
    const updated = leaves.map((lve) =>
      lve.id === leaveId ? { ...lve, status, managerComment } : lve
    );
    setLeaves(updated);
    await StorageService.saveLeaves(updated);
  };

  // Task logic
  const createTask = async (taskData: Omit<TaskItem, 'id' | 'createdAt'>): Promise<TaskItem> => {
    const newTask: TaskItem = {
      ...taskData,
      id: `tsk_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    await StorageService.saveTasks(updated);
    return newTask;
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<void> => {
    const updated = tasks.map((tsk) => (tsk.id === taskId ? { ...tsk, status } : tsk));
    setTasks(updated);
    await StorageService.saveTasks(updated);
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    const updated = tasks.filter((tsk) => tsk.id !== taskId);
    setTasks(updated);
    await StorageService.saveTasks(updated);
  };

  // Announcement logic
  const createAnnouncement = async (
    annData: Omit<Announcement, 'id' | 'createdAt'>
  ): Promise<Announcement> => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    await StorageService.saveAnnouncements(updated);
    return newAnn;
  };

  const deleteAnnouncement = async (id: string): Promise<void> => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    await StorageService.saveAnnouncements(updated);
  };

  // Notification logic
  const markNotificationAsRead = async (id: string): Promise<void> => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    await StorageService.saveNotifications(updated);
  };

  const addEmployee = async (
    data: Omit<Employee, 'id' | 'employeeId' | 'joinDate'> & { employeeId?: string }
  ): Promise<Employee> => {
    const nextNum = employees.length + 1;
    const newEmployee: Employee = {
      ...data,
      id: `emp_${Date.now()}`,
      employeeId: data.employeeId || `EMP-${String(nextNum).padStart(3, '0')}`,
      joinDate: new Date().toISOString().split('T')[0],
      password: data.password || DEFAULT_LOGIN_PASSWORD,
      mustResetPassword: data.mustResetPassword ?? false,
      role: data.role || 'employee',
      status: data.status || 'Active',
      leaveBalance: data.leaveBalance || { vacation: 12, sick: 7, casual: 3 },
      emergencyContact: data.emergencyContact || {
        name: 'Not set',
        relationship: '—',
        phone: '—',
      },
    };
    const updated = [...employees, newEmployee];
    setEmployees(updated);
    await StorageService.saveEmployees(updated);
    return newEmployee;
  };

  const updateEmployee = async (id: string, data: Partial<Employee>): Promise<void> => {
    const updated = employees.map((e) => (e.id === id ? { ...e, ...data } : e));
    setEmployees(updated);
    await StorageService.saveEmployees(updated);
  };

  const deactivateEmployee = async (id: string): Promise<void> => {
    await updateEmployee(id, { status: 'Terminated' });
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        attendance,
        leaves,
        tasks,
        announcements,
        notifications,
        refreshData,
        clockIn,
        clockOut,
        getTodayAttendance,
        submitLeaveRequest,
        updateLeaveStatus,
        createTask,
        updateTaskStatus,
        deleteTask,
        createAnnouncement,
        deleteAnnouncement,
        markNotificationAsRead,
        addEmployee,
        updateEmployee,
        deactivateEmployee,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

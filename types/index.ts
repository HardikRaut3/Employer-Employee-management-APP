export type UserRole = 'employer' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  position: string;
  employeeId: string;
  phone: string;
  mustResetPassword?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  position: string;
  employeeId: string;
  phone: string;
  joinDate: string;
  salary: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  leaveBalance: {
    vacation: number;
    sick: number;
    casual: number;
  };
  mustResetPassword?: boolean;
}
  department: string;
  position: string;
  employeeId: string;
  phone: string;
  joinDate: string;
  salary: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  leaveBalance: {
    vacation: number;
    sick: number;
    casual: number;
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:MM AM/PM
  clockOut?: string; // HH:MM AM/PM
  hoursWorked?: number;
  status: 'Present' | 'Late' | 'Half Day' | 'Absent';
  notes?: string;
}

export type LeaveType = 'Vacation' | 'Sick' | 'Casual' | 'Maternity' | 'Paternity';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  managerComment?: string;
  createdAt: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedToId: string;
  assignedToName: string;
  assignedToAvatar?: string;
  createdById: string;
  createdByName: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  createdAt: string;
}

export type AnnouncementCategory = 'Company News' | 'Policy Update' | 'Event' | 'Urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  isPinned: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'leave' | 'announcement' | 'attendance';
  isRead: boolean;
  createdAt: string;
}

export interface FilterOptions {
  searchQuery?: string;
  department?: string;
  status?: string;
  priority?: string;
}

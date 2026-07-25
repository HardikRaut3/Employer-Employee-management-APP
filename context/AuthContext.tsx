import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { DEFAULT_LOGIN_PASSWORD } from '../constants/auth';

export type LoginResult =
  | { success: true; mustResetPassword?: boolean }
  | { success: false; message: string };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<LoginResult>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  changePassword: (newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const employeeToUser = (match: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  position: string;
  employeeId: string;
  phone: string;
  mustResetPassword?: boolean;
}): User => ({
  id: match.id,
  name: match.name,
  email: match.email,
  role: match.role,
  avatarUrl: match.avatarUrl,
  department: match.department,
  position: match.position,
  employeeId: match.employeeId,
  phone: match.phone,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      await StorageService.initStorage();
      const storedUser = await StorageService.getCurrentUser();
      if (storedUser) {
        const employees = await StorageService.getEmployees();
        const employeeMatch = employees.find((e) => e.id === storedUser.id);

        if (!employeeMatch) {
          await StorageService.setCurrentUser(null);
          return;
        }

        const refreshedUser = {
          ...storedUser,
          name: employeeMatch.name,
          email: employeeMatch.email,
          role: employeeMatch.role,
          avatarUrl: employeeMatch.avatarUrl,
          department: employeeMatch.department,
          position: employeeMatch.position,
          employeeId: employeeMatch.employeeId,
          phone: employeeMatch.phone,
          mustResetPassword: employeeMatch.mustResetPassword || false,
        };

        await StorageService.setCurrentUser(refreshedUser);
        setUser(refreshedUser);
      }
    } catch (e) {
      console.error('Error loading stored user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      await StorageService.initStorage();
      const employees = await StorageService.getEmployees();
      const normalizedEmail = email.toLowerCase().trim();
      const match = employees.find((e) => e.email.toLowerCase() === normalizedEmail);

      if (!match) {
        setIsLoading(false);
        return {
          success: false,
          message: 'No account found with this email. Contact HR or use a demo account.',
        };
      }

      if (role === 'employer') {
        const expectedPassword = match.password || DEFAULT_LOGIN_PASSWORD;
        if (password !== expectedPassword) {
          setIsLoading(false);
          return { success: false, message: 'Incorrect password. Try password123 for demo accounts.' };
        }
      } else {
        const normalizedEmployeeId = password.toUpperCase().trim();
        if (match.employeeId.toUpperCase() !== normalizedEmployeeId) {
          setIsLoading(false);
          return { success: false, message: 'Incorrect Employee ID. Please check and try again.' };
        }
      }

      if (match.role !== role) {
        setIsLoading(false);
        return {
          success: false,
          message:
            role === 'employer'
              ? 'This account is not authorized for the Employer (Admin) portal.'
              : 'This account is not authorized for the Employee portal.',
        };
      }

      if (match.status === 'Terminated') {
        setIsLoading(false);
        return { success: false, message: 'This account has been deactivated.' };
      }

      const loggedUser = employeeToUser(match);
      setUser(loggedUser);
      await StorageService.setCurrentUser(loggedUser);
      setIsLoading(false);
      return {
        success: true,
        mustResetPassword: match.mustResetPassword || false,
      };
    } catch (e) {
      console.error('Login error:', e);
      setIsLoading(false);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const loginAsDemo = async (role: UserRole): Promise<void> => {
    setIsLoading(true);
    await StorageService.initStorage();
    const employees = await StorageService.getEmployees();
    const demoUserMatch =
      employees.find((e) => e.role === role && e.status === 'Active') ||
      employees.find((e) => e.role === role) ||
      employees[0];

    const loggedUser = employeeToUser(demoUserMatch);
    setUser(loggedUser);
    await StorageService.setCurrentUser(loggedUser);
    setIsLoading(false);
  };

  const changePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const employees = await StorageService.getEmployees();
      const updatedEmployees = employees.map((e) =>
        e.id === user.id ? { ...e, password: newPassword, mustResetPassword: false } : e
      );
      await StorageService.saveEmployees(updatedEmployees);

      const updatedUser = { ...user, mustResetPassword: false };
      setUser(updatedUser);
      await StorageService.setCurrentUser(updatedUser);
      return true;
    } catch (e) {
      console.error('Error changing password:', e);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setUser(null);
    await StorageService.setCurrentUser(null);
    setIsLoading(false);
  };

  const updateProfile = async (updatedData: Partial<User>): Promise<void> => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    await StorageService.setCurrentUser(updated);

    const employees = await StorageService.getEmployees();
    const updatedEmployees = employees.map((e) =>
      e.id === user.id ? { ...e, ...updatedData } : e
    );
    await StorageService.saveEmployees(updatedEmployees);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginAsDemo,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

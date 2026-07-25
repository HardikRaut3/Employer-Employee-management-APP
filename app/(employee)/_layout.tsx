import React from 'react';
import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { LayoutDashboard, CheckSquare, CalendarDays, User, Megaphone } from 'lucide-react-native';
import { RoleGate } from '../../components/auth/RoleGate';

export default function EmployeeTabsLayout() {
  return (
    <RoleGate requiredRole="employee">
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primaryAccent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.borderLight,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          paddingBottom: 2,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => <CalendarDays size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'My Tasks',
          tabBarIcon: ({ color, size }) => <CheckSquare size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaves"
        options={{
          title: 'My Leaves',
          tabBarIcon: ({ color, size }) => <CalendarDays size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          href: null, // Accessible via Dashboard links
        }}
      />
    </Tabs>
    </RoleGate>
  );
}

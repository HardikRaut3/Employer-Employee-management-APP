import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { TaskCard } from '../../components/cards/TaskCard';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { CheckSquare, CalendarDays, Megaphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { tasks, leaves, announcements, updateTaskStatus } = useData();
  const router = useRouter();

  const myId = user?.id || 'emp_002';
  const myTasks = tasks.filter((t) => t.assignedToId === myId || t.assignedToName.includes(user?.name || ''));
  const pendingTasks = myTasks.filter((t) => t.status !== 'Completed');
  const myLeaves = leaves.filter((l) => l.employeeId === myId || l.employeeName.includes(user?.name || ''));
  const latestAnnouncement = announcements[0];

  return (
    <View style={styles.container}>
      <Header subtitle={`${user?.position || 'Employee Workspace'}`} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.statsRow}>
          <StatCard
            title="Pending Tasks"
            value={pendingTasks.length}
            icon={<CheckSquare size={18} color={COLORS.warning} />}
            color={COLORS.warning}
            lightColor={COLORS.warningLight}
            onPress={() => router.push('/(employee)/tasks')}
          />

          <StatCard
            title="My Leave Requests"
            value={myLeaves.length}
            icon={<CalendarDays size={18} color={COLORS.purple} />}
            color={COLORS.purple}
            lightColor={COLORS.purpleLight}
            onPress={() => router.push('/(employee)/leaves')}
          />
        </View>

        {/* Assigned Tasks Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Priority Tasks ({pendingTasks.length})</Text>
          <TouchableOpacity onPress={() => router.push('/(employee)/tasks')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {myTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>You have no pending tasks assigned.</Text>
          </View>
        ) : (
          myTasks.slice(0, 2).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
            />
          ))
        )}

        {/* Company Announcements Banner */}
        {latestAnnouncement && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Company Notice Board</Text>
              <TouchableOpacity onPress={() => router.push('/(employee)/announcements')}>
                <Text style={styles.seeAllText}>Read All</Text>
              </TouchableOpacity>
            </View>

            <AnnouncementCard announcement={latestAnnouncement} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryAccent,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});

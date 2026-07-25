import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useData } from '../../context/DataContext';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { LeaveCard } from '../../components/cards/LeaveCard';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Users, UserCheck, CalendarDays, CheckSquare, Plus, Megaphone, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function EmployerDashboard() {
  const { employees, attendance, leaves, tasks, announcements, updateLeaveStatus } = useData();
  const router = useRouter();

  const totalEmployees = employees.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter((a) => a.date === todayStr && a.status === 'Present').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');
  const activeTasks = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <View style={styles.container}>
      <Header subtitle="HR Administration Overview" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stat Cards 2x2 Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Workforce"
              value={totalEmployees}
              icon={<Users size={20} color={COLORS.primaryAccent} />}
              color={COLORS.primaryAccent}
              lightColor={COLORS.primaryLight}
              onPress={() => router.push('/(employer)/employees')}
            />
            <StatCard
              title="Present Today"
              value={presentToday}
              icon={<UserCheck size={20} color={COLORS.success} />}
              color={COLORS.success}
              lightColor={COLORS.successLight}
              onPress={() => router.push('/(employer)/attendance')}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="Pending Leaves"
              value={pendingLeaves.length}
              icon={<CalendarDays size={20} color={COLORS.warning} />}
              color={COLORS.warning}
              lightColor={COLORS.warningLight}
              onPress={() => router.push('/(employer)/leaves')}
            />
            <StatCard
              title="Active Tasks"
              value={activeTasks}
              icon={<CheckSquare size={20} color={COLORS.purple} />}
              color={COLORS.purple}
              lightColor={COLORS.purpleLight}
              onPress={() => router.push('/(employer)/tasks')}
            />
          </View>
        </View>

        {/* Quick Management Shortcuts */}
        <View style={styles.shortcutsCard}>
          <Text style={styles.sectionTitle}>Quick Management Shortcuts</Text>
          <View style={styles.shortcutRow}>
            <TouchableOpacity
              style={styles.shortcutBtn}
              onPress={() => router.push('/(employer)/tasks')}
            >
              <View style={[styles.iconCircle, { backgroundColor: COLORS.primaryLight }]}>
                <Plus size={18} color={COLORS.primaryAccent} />
              </View>
              <Text style={styles.shortcutLabel}>Create Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutBtn}
              onPress={() => router.push('/(employer)/announcements')}
            >
              <View style={[styles.iconCircle, { backgroundColor: COLORS.purpleLight }]}>
                <Megaphone size={18} color={COLORS.purple} />
              </View>
              <Text style={styles.shortcutLabel}>Post Notice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutBtn}
              onPress={() => router.push('/(employer)/attendance')}
            >
              <View style={[styles.iconCircle, { backgroundColor: COLORS.successLight }]}>
                <Clock size={18} color={COLORS.success} />
              </View>
              <Text style={styles.shortcutLabel}>Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Leave Requests Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Leave Approvals ({pendingLeaves.length})</Text>
          <TouchableOpacity onPress={() => router.push('/(employer)/leaves')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {pendingLeaves.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No pending leave requests to review.</Text>
          </View>
        ) : (
          pendingLeaves.slice(0, 2).map((leave) => (
            <LeaveCard
              key={leave.id}
              leave={leave}
              isEmployer
              onApprove={() => updateLeaveStatus(leave.id, 'Approved', 'Approved by HR Director')}
              onReject={() => updateLeaveStatus(leave.id, 'Rejected', 'Rejected due to project deadlines')}
            />
          ))
        )}

        {/* Recent Announcements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Company Notices</Text>
          <TouchableOpacity onPress={() => router.push('/(employer)/announcements')}>
            <Text style={styles.seeAllText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {announcements.slice(0, 2).map((ann) => (
          <AnnouncementCard key={ann.id} announcement={ann} />
        ))}
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
  statsGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  shortcutsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
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
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
  },
  shortcutBtn: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
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

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ClockCard } from '../../components/cards/ClockCard';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Clock, Calendar } from 'lucide-react-native';

export default function EmployeeAttendanceScreen() {
  const { user } = useAuth();
  const { attendance, clockIn, clockOut, getTodayAttendance } = useData();

  const myId = user?.id || 'emp_002';
  const myAttendanceLogs = attendance.filter((a) => a.employeeId === myId || a.employeeName.includes(user?.name || ''));
  const todayAttendance = getTodayAttendance(myId);

  const handleClockIn = async () => {
    try {
      await clockIn(myId, user?.name || 'Employee');
    } catch (error) {
      console.error('Clock in failed:', error);
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOut(myId);
    } catch (error) {
      console.error('Clock out failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Attendance"
        subtitle="Log shift hours & review attendance history"
      />

      <View style={styles.content}>
        <ClockCard
          todayRecord={todayAttendance}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
        />

        <FlatList
          data={myAttendanceLogs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.headerComponent}>
              <Text style={styles.sectionTitle}>Shift History & Time Logs</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.dateRow}>
                  <Calendar size={14} color={COLORS.primaryAccent} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <Badge label={item.status} />
              </View>

              <View style={styles.logMetrics}>
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Clock In</Text>
                  <Text style={styles.metricVal}>{item.clockIn}</Text>
                </View>

                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Clock Out</Text>
                  <Text style={styles.metricVal}>{item.clockOut || 'Active'}</Text>
                </View>

                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Hours</Text>
                  <Text style={styles.metricVal}>
                    {item.hoursWorked ? `${item.hoursWorked} hrs` : '--'}
                  </Text>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<Clock size={28} color={COLORS.primaryAccent} />}
              title="No Attendance Logs"
              description="No attendance records yet."
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  headerComponent: {
    paddingTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginVertical: SPACING.md,
  },
  logCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  logMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.xs,
  },
  metricCol: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
});

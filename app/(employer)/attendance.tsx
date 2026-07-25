import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useData } from '../../context/DataContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Clock, UserCheck, AlertTriangle, UserX, Calendar } from 'lucide-react-native';

export default function EmployerAttendanceScreen() {
  const { attendance, employees } = useData();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Filter records for selected date
  const dateRecords = attendance.filter((a) => a.date === selectedDate);

  const presentCount = dateRecords.filter((a) => a.status === 'Present').length;
  const lateCount = dateRecords.filter((a) => a.status === 'Late').length;
  const absentCount = employees.length - dateRecords.length;

  return (
    <View style={styles.container}>
      <Header
        title="Attendance Records"
        subtitle={`Daily workforce logs for ${selectedDate}`}
      />

      <View style={styles.content}>
        {/* Date Selector Bar */}
        <View style={styles.dateBar}>
          <Calendar size={18} color={COLORS.primaryAccent} />
          <Text style={styles.dateLabel}>Selected Date: {selectedDate}</Text>
          {selectedDate !== todayStr && (
            <TouchableOpacity
              style={styles.todayBtn}
              onPress={() => setSelectedDate(todayStr)}
            >
              <Text style={styles.todayText}>Today</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Attendance Metric Summary */}
        <View style={styles.statsRow}>
          <StatCard
            title="Present"
            value={presentCount}
            icon={<UserCheck size={18} color={COLORS.success} />}
            color={COLORS.success}
            lightColor={COLORS.successLight}
          />
          <StatCard
            title="Late Clock In"
            value={lateCount}
            icon={<AlertTriangle size={18} color={COLORS.warning} />}
            color={COLORS.warning}
            lightColor={COLORS.warningLight}
          />
          <StatCard
            title="Not Clocked"
            value={absentCount < 0 ? 0 : absentCount}
            icon={<UserX size={18} color={COLORS.danger} />}
            color={COLORS.danger}
            lightColor={COLORS.dangerLight}
          />
        </View>

        <Text style={styles.sectionTitle}>Employee Clock In Logs</Text>

        <FlatList
          data={dateRecords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.empInfo}>
                  <Text style={styles.empName}>{item.employeeName}</Text>
                  <Text style={styles.logNote}>{item.notes || 'Shift logged'}</Text>
                </View>
                <Badge label={item.status} />
              </View>

              <View style={styles.logMetrics}>
                <View style={styles.timeCol}>
                  <Text style={styles.timeLabel}>Clock In</Text>
                  <Text style={styles.timeVal}>{item.clockIn}</Text>
                </View>

                <View style={styles.timeCol}>
                  <Text style={styles.timeLabel}>Clock Out</Text>
                  <Text style={styles.timeVal}>{item.clockOut || 'Active Shift'}</Text>
                </View>

                <View style={styles.timeCol}>
                  <Text style={styles.timeLabel}>Total Hours</Text>
                  <Text style={styles.timeVal}>
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
              title="No Logs Available"
              description="No employee attendance logs recorded for this date yet."
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
    padding: SPACING.lg,
  },
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 8,
  },
  dateLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  todayBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
  },
  todayText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryAccent,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
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
    marginBottom: SPACING.sm,
  },
  empInfo: {
    flex: 1,
  },
  empName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  logNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
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
  timeCol: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  timeVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
});

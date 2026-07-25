import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AttendanceRecord } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Clock, LogIn, LogOut, CheckCircle2, MapPin } from 'lucide-react-native';

interface ClockCardProps {
  todayRecord?: AttendanceRecord;
  onClockIn: () => void;
  onClockOut: () => void;
}

export const ClockCard: React.FC<ClockCardProps> = ({
  todayRecord,
  onClockIn,
  onClockOut,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isClockedIn = !!todayRecord?.clockIn;
  const isClockedOut = !!todayRecord?.clockOut;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Clock size={20} color={COLORS.primaryAccent} />
          <Text style={styles.headerTitle}>Daily Shift Tracker</Text>
        </View>

        <View style={styles.locationBadge}>
          <MapPin size={12} color={COLORS.teal} />
          <Text style={styles.locationText}>HQ Office</Text>
        </View>
      </View>

      <Text style={styles.currentTime}>{timeStr || '--:--:--'}</Text>
      <Text style={styles.dateLabel}>
        {new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </Text>

      {/* Interactive Clock Button */}
      <View style={styles.clockBtnContainer}>
        {!isClockedIn ? (
          <TouchableOpacity style={styles.clockInBtn} onPress={onClockIn} activeOpacity={0.8}>
            <LogIn size={24} color="#FFF" />
            <Text style={styles.clockBtnText}>CLOCK IN</Text>
          </TouchableOpacity>
        ) : !isClockedOut ? (
          <TouchableOpacity style={styles.clockOutBtn} onPress={onClockOut} activeOpacity={0.8}>
            <LogOut size={24} color="#FFF" />
            <Text style={styles.clockBtnText}>CLOCK OUT</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBox}>
            <CheckCircle2 size={28} color={COLORS.success} />
            <Text style={styles.completedText}>Shift Completed Today</Text>
          </View>
        )}
      </View>

      {/* Timeline Metrics */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Clock In</Text>
          <Text style={styles.metricVal}>{todayRecord?.clockIn || '--:--'}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Clock Out</Text>
          <Text style={styles.metricVal}>{todayRecord?.clockOut || '--:--'}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Status</Text>
          <Text
            style={[
              styles.metricVal,
              todayRecord?.status === 'Present' && { color: COLORS.success },
              todayRecord?.status === 'Late' && { color: COLORS.warning },
            ]}
          >
            {todayRecord?.status || 'Not Checked'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.teal,
  },
  currentTime: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    letterSpacing: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  clockBtnContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  clockInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryAccent,
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: 10,
    ...SHADOWS.small,
  },
  clockOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: 10,
    ...SHADOWS.small,
  },
  clockBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  completedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    gap: 10,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderLight,
  },
});

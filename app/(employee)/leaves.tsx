import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Header } from '../../components/common/Header';
import { LeaveCard } from '../../components/cards/LeaveCard';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { LeaveType } from '../../types';
import { CalendarDays, Plus } from 'lucide-react-native';

const LEAVE_TYPES: LeaveType[] = ['Vacation', 'Sick', 'Casual', 'Maternity', 'Paternity'];

export default function EmployeeLeavesScreen() {
  const { user } = useAuth();
  const { leaves, employees, submitLeaveRequest } = useData();

  const myId = user?.id || 'emp_002';
  const myName = user?.name || 'Alex Morgan';
  const myProfile = employees.find((e) => e.id === myId);

  const myLeaves = leaves.filter((l) => l.employeeId === myId || l.employeeName.includes(user?.name || ''));

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('Vacation');
  const [startDate, setStartDate] = useState<string>('2026-08-01');
  const [endDate, setEndDate] = useState<string>('2026-08-05');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      setError('Please provide start date, end date, and reason.');
      return;
    }

    await submitLeaveRequest(myId, myName, leaveType, startDate, endDate, reason.trim());

    setReason('');
    setError('');
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Leave Management"
        subtitle="Apply for time off & check leave balance"
      />

      <View style={styles.content}>
        <FlatList
          data={myLeaves}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.headerComponent}>
              {/* Leave Balance Card */}
              <View style={styles.balanceCard}>
                <Text style={styles.balanceCardTitle}>Remaining Leave Allowances</Text>
                <View style={styles.balanceGrid}>
                  <View style={styles.balanceBox}>
                    <Text style={styles.balanceVal}>
                      {myProfile?.leaveBalance?.vacation ?? 12}
                    </Text>
                    <Text style={styles.balanceLabel}>Vacation</Text>
                  </View>

                  <View style={styles.balanceBox}>
                    <Text style={styles.balanceVal}>
                      {myProfile?.leaveBalance?.sick ?? 7}
                    </Text>
                    <Text style={styles.balanceLabel}>Sick</Text>
                  </View>

                  <View style={styles.balanceBox}>
                    <Text style={styles.balanceVal}>
                      {myProfile?.leaveBalance?.casual ?? 3}
                    </Text>
                    <Text style={styles.balanceLabel}>Casual</Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Request History ({myLeaves.length})</Text>
                <Button
                  title="Apply for Leave"
                  onPress={() => setIsModalOpen(true)}
                  size="sm"
                  icon={<Plus size={16} color="#FFF" />}
                />
              </View>
            </View>
          }
          renderItem={({ item }) => <LeaveCard leave={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<CalendarDays size={28} color={COLORS.primaryAccent} />}
              title="No Leave Requests"
              description="You have not submitted any leave requests yet."
              actionTitle="Apply Now"
              onAction={() => setIsModalOpen(true)}
            />
          }
        />
      </View>

      {/* Apply Leave Modal */}
      <Modal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Leave Application"
      >
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <Text style={styles.inputLabel}>Leave Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
          <View style={styles.typeRow}>
            {LEAVE_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, leaveType === t && styles.activeTypeChip]}
                onPress={() => setLeaveType(t)}
              >
                <Text style={[styles.typeText, leaveType === t && styles.activeTypeText]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Input
          label="Start Date (YYYY-MM-DD) *"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="2026-08-01"
        />

        <Input
          label="End Date (YYYY-MM-DD) *"
          value={endDate}
          onChangeText={setEndDate}
          placeholder="2026-08-05"
        />

        <Input
          label="Reason for Leave *"
          value={reason}
          onChangeText={setReason}
          placeholder="Please describe why you are requesting time off..."
          multiline
          numberOfLines={3}
          style={{ height: 75 }}
        />

        <View style={styles.modalActions}>
          <Button
            title="Cancel"
            onPress={() => setIsModalOpen(false)}
            variant="outline"
            size="md"
          />
          <View style={{ flex: 1 }}>
            <Button
              title="Submit Application"
              onPress={handleSubmit}
              variant="primary"
              size="md"
            />
          </View>
        </View>
      </Modal>
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
  balanceCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  balanceCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceBox: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.xs,
    flex: 1,
    marginHorizontal: 4,
  },
  balanceVal: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryAccent,
  },
  balanceLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
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
  listContent: {
    paddingBottom: SPACING.xl,
  },
  errorBanner: {
    fontSize: 12,
    color: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  typeScroll: {
    marginBottom: SPACING.md,
  },
  typeRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  typeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTypeChip: {
    backgroundColor: COLORS.primaryAccent,
    borderColor: COLORS.primaryAccent,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTypeText: {
    color: '#FFF',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
});

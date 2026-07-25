import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useData } from '../../context/DataContext';
import { Header } from '../../components/common/Header';
import { LeaveCard } from '../../components/cards/LeaveCard';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { LeaveStatus } from '../../types';
import { CalendarDays } from 'lucide-react-native';

const STATUS_TABS: LeaveStatus[] = ['Pending', 'Approved', 'Rejected'];

export default function EmployerLeavesScreen() {
  const { leaves, updateLeaveStatus } = useData();
  const [selectedTab, setSelectedTab] = useState<LeaveStatus>('Pending');
  
  // Decision modal state
  const [targetLeaveId, setTargetLeaveId] = useState<string | null>(null);
  const [decisionType, setDecisionType] = useState<'Approved' | 'Rejected' | null>(null);
  const [comment, setComment] = useState<string>('');

  const filteredLeaves = leaves.filter((l) => l.status === selectedTab);

  const openDecisionModal = (leaveId: string, type: 'Approved' | 'Rejected') => {
    setTargetLeaveId(leaveId);
    setDecisionType(type);
    setComment(type === 'Approved' ? 'Approved by HR Director.' : 'Overlapping team coverage constraints.');
  };

  const handleConfirmDecision = async () => {
    if (targetLeaveId && decisionType) {
      await updateLeaveStatus(targetLeaveId, decisionType, comment.trim());
      setTargetLeaveId(null);
      setDecisionType(null);
      setComment('');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Leave Approvals"
        subtitle="Review & approve workforce time-off requests"
      />

      <View style={styles.content}>
        {/* Status Tabs */}
        <View style={styles.tabsContainer}>
          {STATUS_TABS.map((tab) => {
            const count = leaves.filter((l) => l.status === tab).length;
            const isActive = selectedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filteredLeaves}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LeaveCard
              leave={item}
              isEmployer
              onApprove={() => openDecisionModal(item.id, 'Approved')}
              onReject={() => openDecisionModal(item.id, 'Rejected')}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<CalendarDays size={28} color={COLORS.primaryAccent} />}
              title={`No ${selectedTab} Requests`}
              description={`There are currently no leave requests in ${selectedTab} status.`}
            />
          }
        />
      </View>

      {/* Decision Confirmation Modal */}
      <Modal
        visible={!!targetLeaveId}
        onClose={() => setTargetLeaveId(null)}
        title={`${decisionType} Leave Request`}
      >
        <Text style={styles.modalSub}>
          Confirm your decision to {decisionType?.toLowerCase()} this employee leave application.
        </Text>

        <Input
          label="Manager Comment / Note"
          value={comment}
          onChangeText={setComment}
          placeholder="Add an optional comment for the employee..."
          multiline
          numberOfLines={2}
          style={{ height: 60 }}
        />

        <View style={styles.modalActions}>
          <Button
            title="Cancel"
            onPress={() => setTargetLeaveId(null)}
            variant="outline"
            size="md"
          />
          <View style={{ flex: 1 }}>
            <Button
              title={`Confirm ${decisionType}`}
              onPress={handleConfirmDecision}
              variant={decisionType === 'Approved' ? 'success' : 'danger'}
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
    padding: SPACING.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xs,
  },
  activeTab: {
    backgroundColor: COLORS.primaryAccent,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  modalSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LeaveRequest } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Calendar, CheckCircle2, MessageSquare, XCircle } from 'lucide-react-native';

interface LeaveCardProps {
  leave: LeaveRequest;
  onApprove?: () => void;
  onReject?: () => void;
  isEmployer?: boolean;
}

export const LeaveCard: React.FC<LeaveCardProps> = ({
  leave,
  onApprove,
  onReject,
  isEmployer = false,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          {leave.employeeAvatar ? (
            <Image source={{ uri: leave.employeeAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{leave.employeeName.charAt(0)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.employeeName}>{leave.employeeName}</Text>
            <Text style={styles.createdAt}>Requested on {leave.createdAt}</Text>
          </View>
        </View>

        <Badge label={leave.status} />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{leave.leaveType} Leave</Text>
        </View>
        <View style={styles.dateRange}>
          <Calendar size={14} color={COLORS.textSecondary} />
          <Text style={styles.dateText}>
            {leave.startDate} → {leave.endDate} ({leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'})
          </Text>
        </View>
      </View>

      <Text style={styles.reasonLabel}>Reason:</Text>
      <Text style={styles.reasonText}>{leave.reason}</Text>

      {leave.managerComment ? (
        <View style={styles.commentBox}>
          <MessageSquare size={14} color={COLORS.primaryAccent} />
          <Text style={styles.commentText}>
            <Text style={styles.commentBold}>Manager note: </Text>
            {leave.managerComment}
          </Text>
        </View>
      ) : null}

      {/* Employer Decision Actions */}
      {isEmployer && leave.status === 'Pending' && (onApprove || onReject) && (
        <View style={styles.actionRow}>
          {onReject && (
            <View style={{ flex: 1 }}>
              <Button
                title="Reject"
                onPress={onReject}
                variant="danger"
                size="sm"
                icon={<XCircle size={14} color="#FFF" />}
              />
            </View>
          )}
          {onApprove && (
            <View style={{ flex: 1 }}>
              <Button
                title="Approve"
                onPress={onApprove}
                variant="success"
                size="sm"
                icon={<CheckCircle2 size={14} color="#FFF" />}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  createdAt: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.xs,
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  typeBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryAccent,
  },
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  reasonText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginTop: 2,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.sm,
    gap: 6,
  },
  commentText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  commentBold: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
});

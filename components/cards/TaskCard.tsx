import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TaskItem, TaskStatus } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Calendar, CheckCircle2, Clock, Trash2 } from 'lucide-react-native';

interface TaskCardProps {
  task: TaskItem;
  onStatusChange?: (status: TaskStatus) => void;
  onDelete?: () => void;
  isEmployer?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onDelete,
  isEmployer = false,
}) => {
  const isCompleted = task.status === 'Completed';

  return (
    <View style={[styles.card, isCompleted ? styles.completedCard : null]}>
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <Badge label={task.priority} />
          <Badge label={task.category} variant="purple" />
        </View>

        <View style={styles.rightBadges}>
          <Badge label={task.status} />
          {isEmployer && onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
              <Trash2 size={16} color={COLORS.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={[styles.title, isCompleted ? styles.completedText : null]}>
        {task.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.assigneeRow}>
          {task.assignedToAvatar ? (
            <Image source={{ uri: task.assignedToAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{task.assignedToName.charAt(0)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.assigneeLabel}>Assigned To</Text>
            <Text style={styles.assigneeName}>{task.assignedToName}</Text>
          </View>
        </View>

        <View style={styles.dueDateRow}>
          <Calendar size={13} color={COLORS.textSecondary} />
          <Text style={styles.dueDateText}>Due: {task.dueDate}</Text>
        </View>
      </View>

      {/* Quick Action Toggle Bar */}
      {onStatusChange && (
        <View style={styles.actionToggleBar}>
          <TouchableOpacity
            style={[styles.toggleOption, task.status === 'Pending' && styles.activeToggle]}
            onPress={() => onStatusChange('Pending')}
          >
            <Clock size={12} color={task.status === 'Pending' ? COLORS.warning : COLORS.textMuted} />
            <Text style={[styles.toggleText, task.status === 'Pending' && { color: COLORS.warning }]}>
              Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleOption, task.status === 'In Progress' && styles.activeToggle]}
            onPress={() => onStatusChange('In Progress')}
          >
            <Clock size={12} color={task.status === 'In Progress' ? COLORS.primaryAccent : COLORS.textMuted} />
            <Text style={[styles.toggleText, task.status === 'In Progress' && { color: COLORS.primaryAccent }]}>
              In Progress
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleOption, task.status === 'Completed' && styles.activeToggle]}
            onPress={() => onStatusChange('Completed')}
          >
            <CheckCircle2 size={12} color={task.status === 'Completed' ? COLORS.success : COLORS.textMuted} />
            <Text style={[styles.toggleText, task.status === 'Completed' && { color: COLORS.success }]}>
              Completed
            </Text>
          </TouchableOpacity>
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
  completedCard: {
    backgroundColor: '#F8FAFC',
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  rightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  deleteBtn: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  assigneeLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  assigneeName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionToggleBar: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    padding: 3,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: RADIUS.xs - 2,
    gap: 4,
  },
  activeToggle: {
    backgroundColor: COLORS.card,
    ...SHADOWS.small,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});

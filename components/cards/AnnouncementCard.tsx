import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Announcement } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Pin, Trash2 } from 'lucide-react-native';

interface AnnouncementCardProps {
  announcement: Announcement;
  onDelete?: () => void;
  isEmployer?: boolean;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onDelete,
  isEmployer = false,
}) => {
  return (
    <View style={[styles.card, announcement.isPinned ? styles.pinnedCard : null]}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Badge label={announcement.category} />
          {announcement.isPinned && (
            <View style={styles.pinnedBadge}>
              <Pin size={12} color={COLORS.purple} />
              <Text style={styles.pinnedText}>Pinned Notice</Text>
            </View>
          )}
        </View>

        {isEmployer && onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Trash2 size={16} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.content}>{announcement.content}</Text>

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          {announcement.authorAvatar ? (
            <Image source={{ uri: announcement.authorAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{announcement.authorName.charAt(0)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.authorName}>{announcement.authorName}</Text>
            <Text style={styles.authorRole}>{announcement.authorRole}</Text>
          </View>
        </View>

        <Text style={styles.dateText}>{announcement.createdAt}</Text>
      </View>
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
  pinnedCard: {
    borderColor: COLORS.purple,
    backgroundColor: '#FAF5FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.purpleLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.purple,
  },
  deleteBtn: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
  },
  content: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
  },
  avatarFallback: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 11,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  authorRole: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});

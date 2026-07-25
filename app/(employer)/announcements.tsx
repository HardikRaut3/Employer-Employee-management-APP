import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common/Header';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { AnnouncementCategory } from '../../types';
import { Megaphone, Plus, Pin } from 'lucide-react-native';

const CATEGORIES: AnnouncementCategory[] = ['Company News', 'Policy Update', 'Event', 'Urgent'];

export default function EmployerAnnouncementsScreen() {
  const { announcements, createAnnouncement, deleteAnnouncement } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<AnnouncementCategory>('Company News');
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please provide a title and announcement content.');
      return;
    }

    await createAnnouncement({
      title: title.trim(),
      content: content.trim(),
      category,
      authorName: user?.name || 'HR Admin',
      authorRole: user?.position || 'Employer',
      authorAvatar: user?.avatarUrl,
      isPinned,
    });

    setTitle('');
    setContent('');
    setIsPinned(false);
    setError('');
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Company Notices"
        subtitle="Publish news, policy updates, and team events"
      />

      <View style={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.countText}>{announcements.length} Published Notices</Text>
          <Button
            title="Post Notice"
            onPress={() => setIsModalOpen(true)}
            size="sm"
            icon={<Plus size={16} color="#FFF" />}
          />
        </View>

        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AnnouncementCard
              announcement={item}
              isEmployer
              onDelete={() => deleteAnnouncement(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<Megaphone size={28} color={COLORS.primaryAccent} />}
              title="No Company Notices"
              description="Post company announcements to inform your team."
              actionTitle="Post First Notice"
              onAction={() => setIsModalOpen(true)}
            />
          }
        />
      </View>

      {/* Create Announcement Modal */}
      <Modal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Company Notice"
      >
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <Input
          label="Headline Title *"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. 🎉 Annual Company Retreat Announced"
        />

        <Input
          label="Notice Details *"
          value={content}
          onChangeText={setContent}
          placeholder="Write complete notice description..."
          multiline
          numberOfLines={4}
          style={{ height: 90 }}
        />

        <Text style={styles.inputLabel}>Notice Category</Text>
        <View style={styles.catGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, category === cat && styles.activeCatChip]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catText, category === cat && styles.activeCatText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.pinToggle}
          onPress={() => setIsPinned(!isPinned)}
        >
          <Pin size={16} color={isPinned ? COLORS.purple : COLORS.textMuted} />
          <Text style={[styles.pinToggleText, isPinned && { color: COLORS.purple, fontWeight: '700' }]}>
            {isPinned ? 'Pinned to Top of Employee Feed' : 'Pin to Top'}
          </Text>
        </TouchableOpacity>

        <View style={styles.modalActions}>
          <Button
            title="Cancel"
            onPress={() => setIsModalOpen(false)}
            variant="outline"
            size="md"
          />
          <View style={{ flex: 1 }}>
            <Button
              title="Publish Notice"
              onPress={handlePost}
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
    padding: SPACING.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  countText: {
    fontSize: 14,
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
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  catChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeCatChip: {
    backgroundColor: COLORS.primaryAccent,
    borderColor: COLORS.primaryAccent,
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeCatText: {
    color: '#FFF',
    fontWeight: '700',
  },
  pinToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.xs,
    marginBottom: SPACING.lg,
    gap: 8,
  },
  pinToggleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useData } from '../../context/DataContext';
import { Header } from '../../components/common/Header';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { Megaphone } from 'lucide-react-native';

const CATEGORY_FILTERS = ['All', 'Company News', 'Policy Update', 'Event', 'Urgent'];

export default function EmployeeAnnouncementsScreen() {
  const { announcements } = useData();
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filteredAnnouncements = announcements.filter((a) =>
    selectedCat === 'All' ? true : a.category === selectedCat
  );

  return (
    <View style={styles.container}>
      <Header
        title="Company Bulletin Board"
        subtitle="Stay up to date with official corporate news"
      />

      <View style={styles.content}>
        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {CATEGORY_FILTERS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, selectedCat === cat && styles.activeChip]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text style={[styles.chipText, selectedCat === cat && styles.activeChipText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <FlatList
          data={filteredAnnouncements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnnouncementCard announcement={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<Megaphone size={28} color={COLORS.primaryAccent} />}
              title="No Notices Found"
              description="No announcements matching the selected category."
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
  filterScroll: {
    maxHeight: 38,
    marginBottom: SPACING.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeChip: {
    backgroundColor: COLORS.primaryAccent,
    borderColor: COLORS.primaryAccent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeChipText: {
    color: '#FFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
});

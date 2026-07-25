import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Header } from '../../components/common/Header';
import { TaskCard } from '../../components/cards/TaskCard';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { CheckSquare } from 'lucide-react-native';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];

export default function EmployeeTasksScreen() {
  const { user } = useAuth();
  const { tasks, updateTaskStatus } = useData();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const myId = user?.id || 'emp_002';
  const myTasks = tasks.filter((t) => t.assignedToId === myId || t.assignedToName.includes(user?.name || ''));

  const filteredTasks = myTasks.filter((t) =>
    selectedStatus === 'All' ? true : t.status === selectedStatus
  );

  return (
    <View style={styles.container}>
      <Header
        title="My Assigned Tasks"
        subtitle={`${myTasks.length} Assigned Corporate Tasks`}
      />

      <View style={styles.content}>
        {/* Status Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {STATUS_FILTERS.map((st) => (
              <TouchableOpacity
                key={st}
                style={[styles.filterChip, selectedStatus === st && styles.activeChip]}
                onPress={() => setSelectedStatus(st)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedStatus === st && styles.activeFilterText,
                  ]}
                >
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onStatusChange={(status) => updateTaskStatus(item.id, status)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<CheckSquare size={28} color={COLORS.primaryAccent} />}
              title="No Tasks Found"
              description="You currently have no assigned tasks in this status."
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
  filterChip: {
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
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    color: '#FFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
});

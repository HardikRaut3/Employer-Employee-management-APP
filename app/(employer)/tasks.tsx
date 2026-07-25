import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common/Header';
import { TaskCard } from '../../components/cards/TaskCard';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { TaskPriority } from '../../types';
import { CheckSquare, Plus } from 'lucide-react-native';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];

export default function EmployerTasksScreen() {
  const { tasks, employees, createTask, deleteTask, updateTaskStatus } = useData();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [assignedToId, setAssignedToId] = useState<string>(employees[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState<string>('Engineering');
  const [dueDate, setDueDate] = useState<string>('2026-07-28');
  const [modalError, setModalError] = useState<string>('');

  const handleCreateTask = async () => {
    if (!title.trim() || !description.trim() || !assignedToId) {
      setModalError('Please fill in title, description, and select an assignee.');
      return;
    }

    const assignee = employees.find((e) => e.id === assignedToId);

    await createTask({
      title: title.trim(),
      description: description.trim(),
      assignedToId,
      assignedToName: assignee?.name || 'Employee',
      assignedToAvatar: assignee?.avatarUrl,
      createdById: user?.id || 'emp_001',
      createdByName: user?.name || 'HR Admin',
      dueDate,
      priority,
      status: 'Pending',
      category,
    });

    setTitle('');
    setDescription('');
    setModalError('');
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter((task) =>
    selectedStatus === 'All' ? true : task.status === selectedStatus
  );

  return (
    <View style={styles.container}>
      <Header
        title="Task Management"
        subtitle={`${tasks.length} Total Assigned Corporate Tasks`}
      />

      <View style={styles.content}>
        <View style={styles.topBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterRow}>
              {STATUS_FILTERS.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.filterChip, selectedStatus === status && styles.activeChip]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedStatus === status && styles.activeFilterText,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Button
            title="New Task"
            onPress={() => {
              if (!employees || employees.length === 0) {
                setModalError('No employees available. Add employees from the Employees screen.');
                setIsModalOpen(true);
                return;
              }
              setModalError('');
              setIsModalOpen(true);
            }}
            size="sm"
            icon={<Plus size={16} color="#FFF" />}
          />
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              isEmployer
              onDelete={() => deleteTask(item.id)}
              onStatusChange={(status) => updateTaskStatus(item.id, status)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<CheckSquare size={28} color={COLORS.primaryAccent} />}
              title="No Tasks Found"
              description="There are no tasks matching the selected filter status."
              actionTitle="Assign New Task"
              onAction={() => setIsModalOpen(true)}
            />
          }
        />
      </View>

      <Modal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign New Task"
      >
        {modalError ? <Text style={styles.errorText}>{modalError}</Text> : null}

        <Input
          label="Task Title *"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Prepare Quarterly Financial Audit"
        />

        <Input
          label="Description *"
          value={description}
          onChangeText={setDescription}
          placeholder="Detailed task instructions & expected deliverables..."
          multiline
          numberOfLines={3}
          style={{ height: 70 }}
        />

        <Text style={styles.inputLabel}>Assignee Employee *</Text>
        {(!employees || employees.length === 0) ? (
          <Text style={styles.noEmployeesText}>
            No employees available. Add employees from the Employees screen before assigning tasks.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
            <View style={styles.pickerRow}>
              {employees.map((emp) => (
                <TouchableOpacity
                  key={emp.id}
                  style={[
                    styles.assigneeChip,
                    assignedToId === emp.id && styles.activeAssigneeChip,
                  ]}
                  onPress={() => setAssignedToId(emp.id)}
                >
                  <Text
                    style={[
                      styles.assigneeChipText,
                      assignedToId === emp.id && styles.activeAssigneeText,
                    ]}
                  >
                    {emp.name} ({emp.department})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        <Text style={styles.inputLabel}>Priority Level</Text>
        <View style={styles.priorityRow}>
          {(['Low', 'Medium', 'High', 'Urgent'] as TaskPriority[]).map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.pChip, priority === level && styles.activePChip]}
              onPress={() => setPriority(level)}
            >
              <Text style={[styles.pChipText, priority === level && styles.activePText]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Due Date (YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="2026-07-28"
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
              title="Create & Assign"
              onPress={handleCreateTask}
              variant="primary"
              size="md"
              disabled={!employees || employees.length === 0}
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
    gap: SPACING.sm,
  },
  filterScroll: {
    flex: 1,
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
  errorText: {
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
    marginTop: SPACING.xs,
  },
  noEmployeesText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  pickerScroll: {
    marginBottom: SPACING.md,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  assigneeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeAssigneeChip: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryAccent,
  },
  assigneeChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  activeAssigneeText: {
    color: COLORS.primaryAccent,
    fontWeight: '700',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  pChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activePChip: {
    backgroundColor: COLORS.primaryAccent,
    borderColor: COLORS.primaryAccent,
  },
  pChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activePText: {
    color: '#FFF',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
});

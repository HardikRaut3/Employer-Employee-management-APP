import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useData } from '../../../context/DataContext';
import { Header } from '../../../components/common/Header';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { EmployeeCard } from '../../../components/cards/EmployeeCard';
import { EmptyState } from '../../../components/common/EmptyState';
import { COLORS, RADIUS, SPACING } from '../../../constants/theme';
import { DEFAULT_LOGIN_PASSWORD } from '../../../constants/auth';
import { Search, Users, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const DEPARTMENTS_FILTER = ['All', 'Engineering', 'Human Resources', 'Product', 'Design', 'Marketing', 'Finance'];

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80';

export default function EmployeesListScreen() {
  const { employees, addEmployee } = useData();
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const router = useRouter();

  const activeEmployees = employees.filter((e) => e.status !== 'Terminated');

  const filteredEmployees = activeEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const resetForm = () => {
    setName('');
    setEmail('');
    setEmployeeId('');
    setDepartment('Engineering');
    setPosition('');
    setPhone('');
    setSalary('');
    setModalError('');
  };

  const handleAddEmployee = async () => {
    if (!name.trim() || !email.trim() || !employeeId.trim() || !position.trim()) {
      setModalError('Name, email, employee ID, and position are required.');
      return;
    }

    const duplicateEmail = employees.some((e) => e.email.toLowerCase() === email.trim().toLowerCase());
    if (duplicateEmail) {
      setModalError('An employee with this email already exists.');
      return;
    }

    const normalizedId = employeeId.trim().toUpperCase();
    const duplicateId = employees.some((e) => e.employeeId.toUpperCase() === normalizedId);
    if (duplicateId) {
      setModalError('An employee with this Employee ID already exists.');
      return;
    }

    await addEmployee({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      employeeId: normalizedId,
      password: DEFAULT_LOGIN_PASSWORD,
      mustResetPassword: true,
      role: 'employee',
      avatarUrl: DEFAULT_AVATAR,
      department,
      position: position.trim(),
      phone: phone.trim() || '+1 (555) 000-0000',
      salary: salary.trim() || '—',
      status: 'Active',
      emergencyContact: { name: 'Not set', relationship: '—', phone: '—' },
      leaveBalance: { vacation: 12, sick: 7, casual: 3 },
    });

    resetForm();
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Employee Directory" subtitle={`${activeEmployees.length} Active Staff Members`} />

      <View style={styles.content}>
        <View style={styles.toolbar}>
          <View style={styles.searchWrap}>
            <Input
              placeholder="Search by name, position or EMP ID..."
              value={search}
              onChangeText={setSearch}
              icon={<Search size={18} color={COLORS.textMuted} />}
            />
          </View>
          <Button
            title="Add"
            onPress={() => setIsModalOpen(true)}
            size="sm"
            icon={<Plus size={16} color="#FFF" />}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipContent}
        >
          {DEPARTMENTS_FILTER.map((dept) => (
            <TouchableOpacity
              key={dept}
              style={[styles.chip, selectedDept === dept && styles.activeChip]}
              onPress={() => setSelectedDept(dept)}
            >
              <Text style={[styles.chipText, selectedDept === dept && styles.activeChipText]}>
                {dept}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmployeeCard
              employee={item}
              onPress={() => router.push(`/(employer)/employees/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<Users size={28} color={COLORS.primaryAccent} />}
              title="No Employees Found"
              description="No staff members matched your search or department filter."
              actionTitle="Add Employee"
              onAction={() => setIsModalOpen(true)}
            />
          }
        />
      </View>

      <Modal visible={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
        {modalError ? <Text style={styles.errorText}>{modalError}</Text> : null}

        <Input label="Full Name *" value={name} onChangeText={setName} placeholder="Jane Doe" />
        <Input
          label="Work Email *"
          value={email}
          onChangeText={setEmail}
          placeholder="jane.doe@company.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Employee ID *"
          value={employeeId}
          onChangeText={setEmployeeId}
          placeholder="EMP-008"
          autoCapitalize="characters"
        />
        <Input label="Job Title *" value={position} onChangeText={setPosition} placeholder="Software Engineer" />

        <Text style={styles.inputLabel}>Department</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll}>
          <View style={styles.deptRow}>
            {DEPARTMENTS_FILTER.filter((d) => d !== 'All').map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[styles.deptChip, department === dept && styles.activeDeptChip]}
                onPress={() => setDepartment(dept)}
              >
                <Text style={[styles.deptChipText, department === dept && styles.activeDeptText]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+1 (555) 123-4567" />
        <Input label="Salary (optional)" value={salary} onChangeText={setSalary} placeholder="$90,000 / yr" />

        <Text style={styles.passwordNote}>
          Employees will log in with their Work Email and Employee ID (for example, EMP-008).
        </Text>

        <View style={styles.modalActions}>
          <Button title="Cancel" onPress={() => setIsModalOpen(false)} variant="outline" size="md" />
          <View style={{ flex: 1 }}>
            <Button title="Create Employee" onPress={handleAddEmployee} variant="primary" size="md" />
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  searchWrap: {
    flex: 1,
  },
  chipScroll: {
    maxHeight: 38,
    marginBottom: SPACING.md,
  },
  chipContent: {
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
  },
  deptScroll: {
    marginBottom: SPACING.md,
  },
  deptRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  deptChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeDeptChip: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryAccent,
  },
  deptChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  activeDeptText: {
    color: COLORS.primaryAccent,
    fontWeight: '700',
  },
  passwordNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});

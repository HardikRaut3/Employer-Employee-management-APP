import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useData } from '../../../context/DataContext';
import { Badge } from '../../../components/common/Badge';
import { TaskCard } from '../../../components/cards/TaskCard';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../../constants/theme';
import { Employee } from '../../../types';
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, ShieldAlert, CheckSquare, Pencil } from 'lucide-react-native';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { employees, tasks, updateEmployee, deactivateEmployee } = useData();
  const router = useRouter();

  const employee = employees.find((e) => e.id === id);
  const employeeTasks = tasks.filter((t) => t.assignedToId === id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<Employee['status']>('Active');

  const openEdit = () => {
    if (!employee) return;
    setPosition(employee.position);
    setDepartment(employee.department);
    setPhone(employee.phone);
    setSalary(employee.salary);
    setStatus(employee.status);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!employee) return;
    await updateEmployee(employee.id, {
      position: position.trim(),
      department: department.trim(),
      phone: phone.trim(),
      salary: salary.trim(),
      status,
    });
    setIsEditOpen(false);
  };

  const handleDeactivate = () => {
    if (!employee || employee.role === 'employer') {
      Alert.alert('Not allowed', 'Employer admin accounts cannot be deactivated from here.');
      return;
    }
    Alert.alert(
      'Deactivate Employee',
      `Remove ${employee.name} from the active directory? They will no longer be able to sign in.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            await deactivateEmployee(employee.id);
            router.back();
          },
        },
      ]
    );
  };

  if (!employee) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Employee record not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Profile</Text>
        {employee.role !== 'employer' ? (
          <TouchableOpacity onPress={openEdit} style={styles.iconBtn}>
            <Pencil size={18} color={COLORS.primaryAccent} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: employee.avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.position}>{employee.position}</Text>
          <Text style={styles.dept}>{employee.department} • {employee.employeeId}</Text>
          <View style={styles.badgeWrapper}>
            <Badge label={employee.status} size="md" />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL(`mailto:${employee.email}`)}
            >
              <Mail size={16} color={COLORS.primaryAccent} />
              <Text style={styles.contactBtnText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL(`tel:${employee.phone}`)}
            >
              <Phone size={16} color={COLORS.primaryAccent} />
              <Text style={styles.contactBtnText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Detailed Info Grid */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Employment Details</Text>
          
          <View style={styles.infoRow}>
            <Calendar size={16} color={COLORS.textMuted} />
            <Text style={styles.infoLabel}>Join Date:</Text>
            <Text style={styles.infoValue}>{employee.joinDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <DollarSign size={16} color={COLORS.textMuted} />
            <Text style={styles.infoLabel}>Compensation:</Text>
            <Text style={styles.infoValue}>{employee.salary}</Text>
          </View>

          <View style={styles.infoRow}>
            <Mail size={16} color={COLORS.textMuted} />
            <Text style={styles.infoLabel}>Work Email:</Text>
            <Text style={styles.infoValue}>{employee.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Phone size={16} color={COLORS.textMuted} />
            <Text style={styles.infoLabel}>Phone Number:</Text>
            <Text style={styles.infoValue}>{employee.phone}</Text>
          </View>
        </View>

        {/* Leave Allowance */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Leave Balances</Text>
          <View style={styles.leaveBalanceGrid}>
            <View style={styles.balanceBox}>
              <Text style={styles.balanceVal}>{employee.leaveBalance.vacation}</Text>
              <Text style={styles.balanceLabel}>Vacation Days</Text>
            </View>

            <View style={styles.balanceBox}>
              <Text style={styles.balanceVal}>{employee.leaveBalance.sick}</Text>
              <Text style={styles.balanceLabel}>Sick Days</Text>
            </View>

            <View style={styles.balanceBox}>
              <Text style={styles.balanceVal}>{employee.leaveBalance.casual}</Text>
              <Text style={styles.balanceLabel}>Casual Days</Text>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.sectionCard}>
          <View style={styles.titleRow}>
            <ShieldAlert size={18} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
          </View>
          <Text style={styles.contactName}>{employee.emergencyContact.name}</Text>
          <Text style={styles.contactSub}>
            {employee.emergencyContact.relationship} • {employee.emergencyContact.phone}
          </Text>
        </View>

        {/* Assigned Tasks */}
        <View style={styles.sectionTitleRow}>
          <CheckSquare size={18} color={COLORS.primaryAccent} />
          <Text style={styles.sectionTitle}>Assigned Tasks ({employeeTasks.length})</Text>
        </View>

        {employeeTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No active tasks currently assigned to this employee.</Text>
          </View>
        ) : (
          employeeTasks.map((task) => <TaskCard key={task.id} task={task} isEmployer />)
        )}

        {employee.role !== 'employer' && employee.status !== 'Terminated' ? (
          <View style={styles.deactivateWrap}>
            <Button title="Deactivate Employee Account" onPress={handleDeactivate} variant="danger" size="md" />
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Employee">
        <Input label="Position" value={position} onChangeText={setPosition} />
        <Input label="Department" value={department} onChangeText={setDepartment} />
        <Input label="Phone" value={phone} onChangeText={setPhone} />
        <Input label="Salary" value={salary} onChangeText={setSalary} />

        <Text style={styles.inputLabel}>Employment Status</Text>
        <View style={styles.statusRow}>
          {(['Active', 'On Leave', 'Terminated'] as Employee['status'][]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusChip, status === s && styles.activeStatusChip]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.statusChipText, status === s && styles.activeStatusText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.modalActions}>
          <Button title="Cancel" onPress={() => setIsEditOpen(false)} variant="outline" size="md" />
          <View style={{ flex: 1 }}>
            <Button title="Save Changes" onPress={handleSave} variant="primary" size="md" />
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  backBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryAccent,
    borderRadius: RADIUS.sm,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  position: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dept: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badgeWrapper: {
    marginTop: SPACING.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    width: '100%',
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  contactBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryAccent,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    width: 100,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  leaveBalanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.xs,
  },
  balanceBox: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    flex: 1,
    marginHorizontal: 4,
  },
  balanceVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryAccent,
  },
  balanceLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  contactSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  deactivateWrap: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  statusChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeStatusChip: {
    backgroundColor: COLORS.primaryAccent,
    borderColor: COLORS.primaryAccent,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeStatusText: {
    color: '#FFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});

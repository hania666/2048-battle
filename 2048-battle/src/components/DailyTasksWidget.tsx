import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DailyTask } from '../hooks/useDailyTasks';
import { useLanguage } from '../i18n/useLanguage';
import { theme } from '../utils/theme';

interface Props {
  tasks: DailyTask[];
  completedCount: number;
}

export function DailyTasksWidget({ tasks, completedCount }: Props) {
  const { t } = useLanguage();
  if (tasks.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{`📋 ${t('dailyTasks')}`}</Text>
        <Text style={styles.progress}>{completedCount}/{tasks.length}</Text>
      </View>
      {tasks.map(task => (
        <View key={task.id} style={[styles.task, task.completed && styles.taskDone]}>
          <View style={styles.taskLeft}>
            <Text style={styles.taskIcon}>{task.completed ? '✅' : '⬜'}</Text>
            <View>
              <Text style={[styles.taskDesc, task.completed && styles.taskDescDone]}>
                {task.description}
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, {
                  width: `${Math.min(100, (task.current / task.target) * 100)}%` as any
                }]} />
              </View>
              <Text style={styles.progressText}>
                {task.current}/{task.target}
              </Text>
            </View>
          </View>
          <Text style={styles.reward}>+{task.reward}⚡</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: theme.colors.bgCard, borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: theme.colors.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 12, fontWeight: '800', color: theme.colors.text2, letterSpacing: 1.5 },
  progress: { fontSize: 12, fontWeight: '700', color: theme.colors.accent1 },
  task: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  taskDone: { opacity: 0.6 },
  taskLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  taskIcon: { fontSize: 16 },
  taskDesc: { fontSize: 13, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
  taskDescDone: { textDecorationLine: 'line-through', color: theme.colors.text2 },
  progressBar: {
    height: 4, backgroundColor: theme.colors.bgCard2,
    borderRadius: 2, width: 150, marginBottom: 2,
  },
  progressFill: {
    height: 4, backgroundColor: theme.colors.accent1,
    borderRadius: 2,
  },
  progressText: { fontSize: 11, color: theme.colors.text3 },
  reward: { fontSize: 13, fontWeight: '900', color: theme.colors.accent1, marginLeft: 8 },
});

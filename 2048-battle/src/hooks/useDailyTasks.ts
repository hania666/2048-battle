import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'daily_tasks_2048';
const TASKS_DATE_KEY = 'daily_tasks_date_2048';

export interface DailyTask {
  id: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  type: 'score' | 'wins' | 'matches' | 'tile';
}

const TASK_POOLS: DailyTask[] = [
  { id: 'score_3000', description: 'Score 3000 points in a match', target: 3000, current: 0, reward: 3, completed: false, type: 'score' },
  { id: 'score_5000', description: 'Score 5000 points in a match', target: 5000, current: 0, reward: 5, completed: false, type: 'score' },
  { id: 'wins_2', description: 'Win 2 matches', target: 2, current: 0, reward: 4, completed: false, type: 'wins' },
  { id: 'wins_3', description: 'Win 3 matches', target: 3, current: 0, reward: 6, completed: false, type: 'wins' },
  { id: 'matches_5', description: 'Play 5 matches', target: 5, current: 0, reward: 3, completed: false, type: 'matches' },
  { id: 'tile_256', description: 'Reach tile 256', target: 256, current: 0, reward: 4, completed: false, type: 'tile' },
  { id: 'tile_512', description: 'Reach tile 512', target: 512, current: 0, reward: 6, completed: false, type: 'tile' },
];

function getRandomTasks(): DailyTask[] {
  const shuffled = [...TASK_POOLS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map(t => ({ ...t, current: 0, completed: false }));
}

function isNewDay(savedDate: string): boolean {
  const saved = new Date(savedDate).toDateString();
  const today = new Date().toDateString();
  return saved !== today;
}

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    const [savedTasks, savedDate] = await Promise.all([
      AsyncStorage.getItem(TASKS_KEY),
      AsyncStorage.getItem(TASKS_DATE_KEY),
    ]);

    if (!savedDate || isNewDay(savedDate) || !savedTasks) {
      const newTasks = getRandomTasks();
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(newTasks));
      await AsyncStorage.setItem(TASKS_DATE_KEY, new Date().toISOString());
      setTasks(newTasks);
    } else {
      setTasks(JSON.parse(savedTasks));
    }
  };

  const updateProgress = useCallback(async (type: DailyTask['type'], value: number) => {
    const saved = await AsyncStorage.getItem(TASKS_KEY);
    if (!saved) return [];

    const currentTasks: DailyTask[] = JSON.parse(saved);
    let rewards = 0;

    const updated = currentTasks.map(task => {
      if (task.completed || task.type !== type) return task;
      let newCurrent = task.current;
      if (type === 'score' || type === 'tile') {
        newCurrent = Math.max(task.current, value);
      } else {
        newCurrent = task.current + value;
      }
      const completed = newCurrent >= task.target;
      if (completed && !task.completed) rewards += task.reward;
      return { ...task, current: newCurrent, completed };
    });

    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    setTasks(updated);
    return rewards > 0 ? [rewards] : [];
  }, []);

  const completedCount = tasks.filter(t => t.completed).length;

  return { tasks, updateProgress, completedCount };
}

import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NOTIF_KEY = 'notifications_enabled_2048';

export function useNotifications() {
  const registerForNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
      await AsyncStorage.setItem(NOTIF_KEY, 'true');
    } catch (e) {
      console.warn('Notifications not available:', e);
    }
  };

  useEffect(() => {
    registerForNotifications();
  }, []);

  const scheduleEnergyNotification = async (minutesUntilFull: number) => {
    try {
      const enabled = await AsyncStorage.getItem(NOTIF_KEY);
      if (enabled !== 'true') return;
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚡ Energy Full!',
          body: 'Your energy is fully restored. Time to battle!',
          sound: true,
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: minutesUntilFull * 60,
        },
      });
    } catch (e) {}
  };

  const scheduleDailyBonusNotification = async () => {
    try {
      const enabled = await AsyncStorage.getItem(NOTIF_KEY);
      if (enabled !== 'true') return;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎁 Daily Bonus Available!',
          body: 'Claim your daily bonus and start playing!',
          sound: true,
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: 10,
          minute: 0,
        },
      });
    } catch (e) {}
  };

  const sendMatchFoundNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚔️ Match Found!',
          body: 'Your opponent is ready. Lets battle!',
          sound: true,
        },
        trigger: null,
      });
    } catch (e) {}
  };

  return {
    scheduleEnergyNotification,
    scheduleDailyBonusNotification,
    sendMatchFoundNotification,
  };
}

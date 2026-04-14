import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

let soundEnabled = true;
let musicEnabled = true;

async function loadSettings() {
  const saved = await AsyncStorage.getItem('settings_2048');
  if (saved) {
    const parsed = JSON.parse(saved);
    soundEnabled = parsed.sound !== false;
    musicEnabled = parsed.music !== false;
  }
}

class SoundManager {
  private musicPlayer: any = null;

  async init() {
    await loadSettings();
    try {
      const { AudioPlayer, createAudioPlayer } = await import('expo-audio');
      console.log('expo-audio loaded');
    } catch (e) {
      console.warn('expo-audio not available:', e);
    }
  }

  async updateSettings(sound: boolean, music: boolean) {
    soundEnabled = sound;
    musicEnabled = music;
    if (!music) await this.stopMusic();
    else await this.playMusic();
  }

  async playMerge() {
    if (!soundEnabled) return;
    try {
      const { createAudioPlayer } = await import('expo-audio');
      const player = createAudioPlayer(require('../../assets/sounds/merge.wav'));
      player.volume = 0.5;
      player.play();
    } catch (e) {}
  }

  async playWin() {
    if (!soundEnabled) return;
    try {
      const { createAudioPlayer } = await import('expo-audio');
      const player = createAudioPlayer(require('../../assets/sounds/win.wav'));
      player.volume = 0.7;
      player.play();
    } catch (e) {}
  }

  async playLose() {
    if (!soundEnabled) return;
    try {
      const { createAudioPlayer } = await import('expo-audio');
      const player = createAudioPlayer(require('../../assets/sounds/lose.wav'));
      player.volume = 0.7;
      player.play();
    } catch (e) {}
  }

  async playBonus() {
    if (!soundEnabled) return;
    try {
      const { createAudioPlayer } = await import('expo-audio');
      const player = createAudioPlayer(require('../../assets/sounds/bonus.wav'));
      player.volume = 0.6;
      player.play();
    } catch (e) {}
  }

  async playMusic() {
    if (!musicEnabled) return;
    try {
      await this.stopMusic();
      const { createAudioPlayer } = await import('expo-audio');
      this.musicPlayer = createAudioPlayer(require('../../assets/sounds/music.wav'));
      this.musicPlayer.volume = 0.3;
      this.musicPlayer.loop = true;
      this.musicPlayer.play();
      console.log('Music playing!');
    } catch (e) {
      console.warn('Music error:', e);
    }
  }

  async stopMusic() {
    try {
      if (this.musicPlayer) {
        this.musicPlayer.remove();
        this.musicPlayer = null;
      }
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();

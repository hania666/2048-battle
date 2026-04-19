import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const PLAYER_KEY = 'player_2048_local';

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com.battle2048.app://auth/callback',
          skipBrowserRedirect: true,
          queryParams: {
            client_id: '297772176529-ddrp3braobv4ku18bpctpuu4n6vhtap0.apps.googleusercontent.com',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          'com.battle2048.app://auth/callback'
        );

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const accessToken = url.searchParams.get('access_token');
          const refreshToken = url.searchParams.get('refresh_token');

          if (accessToken) {
            const { data: sessionData } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (sessionData.user) {
              return sessionData.user;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Google auth error:', e);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(PLAYER_KEY);
  };

  return { signInWithGoogle, signOut, loading };
}

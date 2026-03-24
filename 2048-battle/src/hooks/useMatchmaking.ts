import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { Player } from './usePlayer';

export type MatchStatus = 'searching' | 'found' | 'playing' | 'finished';

export interface Match {
  id: string;
  player1_id: string;
  player2_id: string | null;
  player1_score: number;
  player2_score: number;
  player1_board: number[][];
  player2_board: number[][];
  seed: number;
  status: string;
  winner_id: string | null;
}

export function useMatchmaking(player: Player) {
  const [status, setStatus] = useState<MatchStatus>('searching');
  const [match, setMatch] = useState<Match | null>(null);
  const [opponentNickname, setOpponentNickname] = useState<string>('');
  const subscriptionRef = useRef<any>(null);
  const matchIdRef = useRef<string | null>(null);

  const findMatch = useCallback(async () => {
    setStatus('searching');
    try {
      // Ищем открытый матч
      const { data: waiting } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'waiting')
        .neq('player1_id', player.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (waiting) {
        // Присоединяемся к матчу
        const { data: joined } = await supabase
          .from('matches')
          .update({
            player2_id: player.id,
            status: 'playing',
            started_at: new Date().toISOString(),
          })
          .eq('id', waiting.id)
          .eq('status', 'waiting')
          .select()
          .single();

        if (joined) {
          matchIdRef.current = joined.id;
          setMatch(joined);
          setStatus('found');

          // Получаем никнейм противника
          const { data: p1 } = await supabase
            .from('players')
            .select('nickname')
            .eq('id', joined.player1_id)
            .single();
          if (p1) setOpponentNickname(p1.nickname);
          return;
        }
      }

      // Создаём новый матч
      const seed = Math.floor(Math.random() * 1000000);
      const { data: created } = await supabase
        .from('matches')
        .insert({
          player1_id: player.id,
          seed,
          status: 'waiting',
        })
        .select()
        .single();

      if (created) {
        matchIdRef.current = created.id;
        setMatch(created);
        // Ждём противника через realtime
        subscribeToMatch(created.id);
      }
    } catch (e) {
      console.warn('Matchmaking error:', e);
    }
  }, [player.id]);

  const subscribeToMatch = useCallback((matchId: string) => {
    subscriptionRef.current = supabase
      .channel(`match:${matchId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'matches',
        filter: `id=eq.${matchId}`,
      }, async (payload) => {
        const updated = payload.new as Match;
        setMatch(updated);

        if (updated.status === 'playing' && updated.player2_id) {
          setStatus('found');
          const opponentId = updated.player1_id === player.id
            ? updated.player2_id
            : updated.player1_id;
          const { data: opp } = await supabase
            .from('players')
            .select('nickname')
            .eq('id', opponentId)
            .single();
          if (opp) setOpponentNickname(opp.nickname);
        }

        if (updated.status === 'finished') {
          setStatus('finished');
        }
      })
      .subscribe();
  }, [player.id]);

  const updateScore = useCallback(async (
    score: number,
    board: number[][],
  ) => {
    if (!matchIdRef.current || !match) return;
    const isPlayer1 = match.player1_id === player.id;
    await supabase
      .from('matches')
      .update(isPlayer1
        ? { player1_score: score, player1_board: board }
        : { player2_score: score, player2_board: board }
      )
      .eq('id', matchIdRef.current);
  }, [match, player.id]);

  const finishMatch = useCallback(async (myScore: number, opponentScore: number) => {
    if (!matchIdRef.current || !match) return;
    const winnerId = myScore >= opponentScore ? player.id :
      (match.player1_id === player.id ? match.player2_id : match.player1_id);
    await supabase
      .from('matches')
      .update({ status: 'finished', winner_id: winnerId, finished_at: new Date().toISOString() })
      .eq('id', matchIdRef.current);
    setStatus('finished');
  }, [match, player.id, matchIdRef]);

  const cancelSearch = useCallback(async () => {
    if (matchIdRef.current) {
      await supabase.from('matches').delete().eq('id', matchIdRef.current).eq('status', 'waiting');
    }
    subscriptionRef.current?.unsubscribe();
    setStatus('searching');
    setMatch(null);
  }, []);

  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  return { status, match, opponentNickname, findMatch, updateScore, finishMatch, cancelSearch };
}

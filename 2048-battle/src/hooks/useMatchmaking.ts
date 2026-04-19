import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { Player } from './usePlayer';

export type MatchStatus = 'searching' | 'found' | 'playing' | 'finished' | 'timeout';

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

const SEARCH_TIMEOUT = 30000; // 30 секунд

export function useMatchmaking(player: Player) {
  const [status, setStatus] = useState<MatchStatus>('searching');
  const [match, setMatch] = useState<Match | null>(null);
  const [opponentNickname, setOpponentNickname] = useState<string>('');
  const subscriptionRef = useRef<any>(null);
  const matchIdRef = useRef<string | null>(null);
  const matchRef = useRef<Match | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef = useRef(false);

  const clearSearchTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const findMatch = useCallback(async () => {
    setStatus('searching');
    finishedRef.current = false;

    // Timeout — если за 30 сек никого нет
    timeoutRef.current = setTimeout(async () => {
      if (matchIdRef.current) {
        await supabase.from('matches').delete()
          .eq('id', matchIdRef.current).eq('status', 'waiting');
      }
      subscriptionRef.current?.unsubscribe();
      setStatus('timeout');
    }, SEARCH_TIMEOUT);

    try {
      // Пробуем взять матч атомарно через rpc или double-check
      const { data: waiting } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'waiting')
        .neq('player1_id', player.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (waiting) {
        // Атомарное обновление — только если статус всё ещё waiting
        const { data: joined, error } = await supabase
          .from('matches')
          .update({
            player2_id: player.id,
            status: 'playing',
            started_at: new Date().toISOString(),
          })
          .eq('id', waiting.id)
          .eq('status', 'waiting') // guard против race condition
          .select()
          .single();

        if (joined && !error) {
          clearSearchTimeout();
          matchIdRef.current = joined.id;
          matchRef.current = joined;
          setMatch(joined);
          setStatus('found');

          const { data: p1 } = await supabase
            .from('players')
            .select('nickname')
            .eq('id', joined.player1_id)
            .single();
          if (p1) setOpponentNickname(p1.nickname);
          subscribeToMatch(joined.id);
          return;
        }
        // Если не получилось — кто-то опередил, создаём свой матч
      }

      // Создаём новый матч
      const seed = Math.floor(Math.random() * 1000000);
      const { data: created } = await supabase
        .from('matches')
        .insert({ player1_id: player.id, seed, status: 'waiting' })
        .select()
        .single();

      if (created) {
        matchIdRef.current = created.id;
        matchRef.current = created;
        setMatch(created);
        subscribeToMatch(created.id);
      }
    } catch (e) {
      clearSearchTimeout();
      console.warn('Matchmaking error:', e);
      setStatus('timeout');
    }
  }, [player.id]);

  const subscribeToMatch = useCallback((matchId: string) => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = supabase
      .channel(`match:${matchId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'matches',
        filter: `id=eq.${matchId}`,
      }, async (payload) => {
        const updated = payload.new as Match;
        matchRef.current = updated;
        setMatch(updated);

        if (updated.status === 'playing' && updated.player2_id) {
          clearSearchTimeout();
          setStatus('found');
          const opponentId = updated.player1_id === player.id
            ? updated.player2_id
            : updated.player1_id;
          const { data: opp } = await supabase
            .from('players').select('nickname').eq('id', opponentId).single();
          if (opp) setOpponentNickname(opp.nickname);
        }

        if (updated.status === 'finished') {
          setStatus('finished');
        }
      })
      .subscribe();
  }, [player.id]);

  // Используем matchRef чтобы не было stale closure
  const updateScore = useCallback(async (score: number, board: number[][]) => {
    const currentMatch = matchRef.current;
    if (!matchIdRef.current || !currentMatch) return;
    const isPlayer1 = currentMatch.player1_id === player.id;
    try {
      await supabase
        .from('matches')
        .update(isPlayer1
          ? { player1_score: score, player1_board: board }
          : { player2_score: score, player2_board: board }
        )
        .eq('id', matchIdRef.current);
    } catch (e) {
      console.warn('updateScore error:', e);
    }
  }, [player.id]);

  // Только один игрок финишит матч — тот у кого больше счёт
  const finishMatch = useCallback(async (myScore: number, opponentScore: number) => {
    const currentMatch = matchRef.current;
    if (!matchIdRef.current || !currentMatch || finishedRef.current) return;
    finishedRef.current = true;

    const isPlayer1 = currentMatch.player1_id === player.id;
    const winnerId = myScore >= opponentScore ? player.id :
      (isPlayer1 ? currentMatch.player2_id : currentMatch.player1_id);

    try {
      await supabase
        .from('matches')
        .update({
          status: 'finished',
          winner_id: winnerId,
          finished_at: new Date().toISOString(),
          ...(isPlayer1
            ? { player1_score: myScore }
            : { player2_score: myScore }
          ),
        })
        .eq('id', matchIdRef.current)
        .neq('status', 'finished'); // не перезаписываем если уже finished
    } catch (e) {
      console.warn('finishMatch error:', e);
    }
    setStatus('finished');
  }, [player.id]);

  const cancelSearch = useCallback(async () => {
    clearSearchTimeout();
    if (matchIdRef.current) {
      await supabase.from('matches').delete()
        .eq('id', matchIdRef.current).eq('status', 'waiting');
    }
    subscriptionRef.current?.unsubscribe();
    matchIdRef.current = null;
    matchRef.current = null;
    finishedRef.current = false;
    setStatus('searching');
    setMatch(null);
  }, []);

  useEffect(() => {
    return () => {
      clearSearchTimeout();
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  return { status, match, opponentNickname, findMatch, updateScore, finishMatch, cancelSearch };
}

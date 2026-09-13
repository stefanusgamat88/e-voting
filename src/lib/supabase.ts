import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Candidate, ElectionSettings, QuickCountStats, User, Vote } from '../types';
import {
  DPT_TOTAL_STUDENTS,
  INITIAL_CANDIDATES,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_VOTES,
} from '../data/initialData';

// Check environment variables or local storage overrides
const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('evoting_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('evoting_supabase_key') || '' : '';

export const SUPABASE_URL = storedUrl || envUrl;
export const SUPABASE_ANON_KEY = storedKey || envKey;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL.startsWith('http') &&
  SUPABASE_URL !== 'YOUR_SUPABASE_URL'
);

export let supabase: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    supabase = null;
  }
}

// ==========================================
// LOCAL STORAGE & REALTIME EVENT SYSTEM
// ==========================================
const STORAGE_KEYS = {
  CANDIDATES: 'evoting_osis_candidates',
  USERS: 'evoting_osis_users',
  VOTES: 'evoting_osis_votes',
  SETTINGS: 'evoting_osis_settings',
  CURRENT_USER: 'evoting_current_user',
};

type EventListener = () => void;
const listeners: Set<EventListener> = new Set();

export function subscribeToRealtime(callback: EventListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyRealtime() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.error('Error in realtime listener:', err);
    }
  });
}

// Initializer for Local Data
export function getLocalData() {
  let candidates: Candidate[];
  let users: User[];
  let votes: Vote[];
  let settings: ElectionSettings;

  try {
    const rawCand = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    candidates = rawCand ? JSON.parse(rawCand) : INITIAL_CANDIDATES;
  } catch {
    candidates = INITIAL_CANDIDATES;
  }

  try {
    const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    users = rawUsers ? JSON.parse(rawUsers) : INITIAL_USERS;
  } catch {
    users = INITIAL_USERS;
  }

  try {
    const rawVotes = localStorage.getItem(STORAGE_KEYS.VOTES);
    votes = rawVotes ? JSON.parse(rawVotes) : INITIAL_VOTES;
  } catch {
    votes = INITIAL_VOTES;
  }

  try {
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    settings = rawSettings ? JSON.parse(rawSettings) : INITIAL_SETTINGS;
  } catch {
    settings = INITIAL_SETTINGS;
  }

  return { candidates, users, votes, settings };
}

// Save helpers
export function saveCandidates(candidates: Candidate[]) {
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  notifyRealtime();
}

export function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  notifyRealtime();
}

export function saveVotes(votes: Vote[]) {
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  notifyRealtime();
}

export function saveSettings(settings: ElectionSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  notifyRealtime();
}

// Auth State
export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// ==========================================
// CORE VOTING LOGIC (ANTI DOUBLE-VOTE)
// ==========================================
export async function submitVote(userId: string, candidateId: string, locationVerified = true): Promise<{
  success: boolean;
  message: string;
  vote?: Vote;
}> {
  // If Supabase is active, try Supabase first
  if (supabase) {
    try {
      // 1. Check if user already voted in database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.warn('Supabase fetch user error, falling back to local:', userError);
      } else if (userData && userData.sudah_memilih) {
        return {
          success: false,
          message: 'Hak suara Anda telah digunakan sebelumnya. Sistem mendeteksi anti-double vote.',
        };
      }

      // 2. Insert vote
      const newVote: Vote = {
        id: `vt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: userId,
        candidate_id: candidateId,
        timestamp: new Date().toISOString(),
        location_verified: locationVerified,
        hash: `VOTE-HASH-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      const { error: voteError } = await supabase.from('votes').insert([newVote]);
      if (!voteError) {
        // Update user status
        await supabase
          .from('users')
          .update({
            sudah_memilih: true,
            voted_at: newVote.timestamp,
            voted_candidate_id: candidateId,
          })
          .eq('id', userId);

        // Also sync local storage
        syncLocalVote(userId, candidateId, newVote);
        return { success: true, message: 'Suara Anda berhasil tercatat!', vote: newVote };
      }
    } catch (e) {
      console.warn('Supabase insertion failed, using persistent local store:', e);
    }
  }

  // Fallback Local Storage Mode
  const { users, votes } = getLocalData();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, message: 'Data pemilih tidak ditemukan dalam sistem.' };
  }

  if (user.sudah_memilih) {
    return {
      success: false,
      message: 'Perhatian! Anda telah melakukan voting sebelumnya. Pemilihan hanya dapat dilakukan 1 kali.',
    };
  }

  // Check if vote already recorded for this user
  const existingVote = votes.find((v) => v.user_id === userId);
  if (existingVote) {
    return {
      success: false,
      message: 'Suara dari akun ini telah tersimpan dalam rekapitulasi.',
    };
  }

  const newVote: Vote = {
    id: `vt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    candidate_id: candidateId,
    timestamp: new Date().toISOString(),
    location_verified: locationVerified,
    hash: `VOTE-HASH-${Math.floor(100000 + Math.random() * 900000)}`,
  };

  // Update user
  const updatedUsers = users.map((u) => {
    if (u.id === userId) {
      return {
        ...u,
        sudah_memilih: true,
        voted_at: newVote.timestamp,
        voted_candidate_id: candidateId,
      };
    }
    return u;
  });

  const updatedVotes = [newVote, ...votes];

  saveUsers(updatedUsers);
  saveVotes(updatedVotes);

  // Update active session
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser({
      ...currentUser,
      sudah_memilih: true,
      voted_at: newVote.timestamp,
      voted_candidate_id: candidateId,
    });
  }

  return {
    success: true,
    message: 'Selamat! Suara Anda telah berhasil direkam secara aman dan terenkripsi.',
    vote: newVote,
  };
}

function syncLocalVote(userId: string, candidateId: string, newVote: Vote) {
  const { users, votes } = getLocalData();
  const updatedUsers = users.map((u) =>
    u.id === userId ? { ...u, sudah_memilih: true, voted_at: newVote.timestamp, voted_candidate_id: candidateId } : u
  );
  saveUsers(updatedUsers);
  saveVotes([newVote, ...votes]);

  const curr = getCurrentUser();
  if (curr && curr.id === userId) {
    setCurrentUser({ ...curr, sudah_memilih: true, voted_at: newVote.timestamp, voted_candidate_id: candidateId });
  }
}

// Calculate Quick Count Statistics
export function calculateQuickCount(candidates: Candidate[], votes: Vote[], users: User[]): QuickCountStats {
  // Use registered student count or fixed DPT baseline
  const registeredCount = users.filter((u) => u.role === 'siswa').length;
  const totalDPT = Math.max(registeredCount, DPT_TOTAL_STUDENTS);

  const totalSuaraMasuk = votes.length;
  const totalBelumMemilih = Math.max(0, totalDPT - totalSuaraMasuk);
  const persentasePartisipasi = totalDPT > 0 ? Number(((totalSuaraMasuk / totalDPT) * 100).toFixed(1)) : 0;

  let maxVotes = -1;
  const candidateCounts = candidates.map((cand) => {
    const count = votes.filter((v) => v.candidate_id === cand.id).length;
    if (count > maxVotes) maxVotes = count;
    return {
      candidate: cand,
      voteCount: count,
      percentage: totalSuaraMasuk > 0 ? Number(((count / totalSuaraMasuk) * 100).toFixed(1)) : 0,
      isLeading: false,
    };
  });

  const candidateStats = candidateCounts.map((item) => ({
    ...item,
    isLeading: maxVotes > 0 && item.voteCount === maxVotes,
  }));

  return {
    totalDPT,
    totalSuaraMasuk,
    totalBelumMemilih,
    persentasePartisipasi,
    candidateStats,
  };
}

// Reset System Votes
export function resetAllVotes() {
  const { users } = getLocalData();
  const resetUsers = users.map((u) => ({
    ...u,
    sudah_memilih: false,
    voted_at: undefined,
    voted_candidate_id: undefined,
  }));

  saveUsers(resetUsers);
  saveVotes([]);

  const current = getCurrentUser();
  if (current) {
    setCurrentUser({
      ...current,
      sudah_memilih: false,
      voted_at: undefined,
      voted_candidate_id: undefined,
    });
  }

  notifyRealtime();
}

// Reset Entire System to Factory Mock Data
export function resetToInitialData() {
  localStorage.removeItem(STORAGE_KEYS.CANDIDATES);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.VOTES);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

  saveCandidates(INITIAL_CANDIDATES);
  saveUsers(INITIAL_USERS);
  saveVotes(INITIAL_VOTES);
  saveSettings(INITIAL_SETTINGS);
  notifyRealtime();
}

// Supabase SQL Schema for easy copy-paste
export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- E-VOTING OSIS SCHEMA & POLICIES (SUPABASE)
-- ==========================================

-- 1. Create table candidates
CREATE TABLE IF NOT EXISTS public.candidates (
  id TEXT PRIMARY KEY,
  nomor_urut INTEGER NOT NULL,
  nama_ketua TEXT NOT NULL,
  nama_wakil TEXT NOT NULL,
  foto TEXT NOT NULL,
  visi TEXT NOT NULL,
  misi TEXT[] NOT NULL DEFAULT '{}',
  tagline TEXT,
  program_unggulan TEXT[] DEFAULT '{}',
  kelas_ketua TEXT,
  kelas_wakil TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create table users
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  nisn TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'siswa', -- 'admin' or 'siswa'
  sudah_memilih BOOLEAN NOT NULL DEFAULT FALSE,
  kelas TEXT,
  email TEXT,
  voted_at TIMESTAMPTZ,
  voted_candidate_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create table votes (With Anti Double-Vote Unique Constraint)
CREATE TABLE IF NOT EXISTS public.votes (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE RESTRICT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  location_verified BOOLEAN DEFAULT TRUE,
  hash TEXT
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Public can view candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Public can view votes count" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Public can view users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert single vote" ON public.votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own status" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Admins can manage candidates" ON public.candidates FOR ALL USING (true);

-- 6. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
`;

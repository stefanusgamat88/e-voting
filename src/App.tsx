import React, { useState, useEffect, useCallback } from 'react';
import { Candidate, ElectionSettings, QuickCountStats, User, Vote } from './types';
import {
  calculateQuickCount,
  getCurrentUser,
  getLocalData,
  isSupabaseConfigured,
  setCurrentUser,
  submitVote,
  subscribeToRealtime,
  setupSessionExpirationWatcher,
  logoutUser,
  touchSession,
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CandidatesSection } from './components/CandidatesSection';
import { VotingFlowSteps } from './components/VotingFlowSteps';
import { QuickCount } from './components/QuickCount';
import { VotingPage } from './components/VotingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { VoteConfirmModal } from './components/VoteConfirmModal';
import { VoteReceiptModal } from './components/VoteReceiptModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { SessionExpiredModal } from './components/SessionExpiredModal';
import { PrintBallotCard } from './components/PrintBallotCard';
import { RecapResults } from './components/RecapResults';
import { OfficialReport } from './components/OfficialReport';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    'beranda' | 'quickcount' | 'voting' | 'admin' | 'kartu-suara' | 'rekapitulasi' | 'berita-acara'
  >('beranda');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('evoting_theme');
      if (saved) return saved === 'dark';
      return false; // Default to clean modern light mode as requested
    }
    return false;
  });

  // Data Store State
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [settings, setSettings] = useState<ElectionSettings>({
    title: 'PEMILIHAN KETUA & WAKIL KETUA OSIS',
    school_name: 'SMA NEGERI 1 TELADAN',
    period: 'Periode 2026/2027',
    status: 'Sedang Berlangsung',
    start_date: '',
    end_date: '',
    allow_geolocation: true,
  });

  // Current Logged-in User
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [sessionExpiredReason, setSessionExpiredReason] = useState<string | null>(null);

  // Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState<Candidate | null>(null);
  const [candidateToConfirm, setCandidateToConfirm] = useState<Candidate | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    vote: Vote | null;
    candidate: Candidate | null;
    user: User | null;
  } | null>(null);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Sync Dark Mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('evoting_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('evoting_theme', 'light');
    }
  }, [darkMode]);

  // Load Data
  const loadData = useCallback(() => {
    const data = getLocalData();
    setCandidates(data.candidates);
    setUsers(data.users);
    setVotes(data.votes);
    setSettings(data.settings);

    // Refresh active session from persistent store
    const user = getCurrentUser();
    if (user) {
      const refreshedUser = data.users.find((u) => u.id === user.id) || user;
      setCurrentUserState(refreshedUser);
    } else {
      setCurrentUserState(null);
    }
  }, []);

  // Initial Load and Realtime Subscription
  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToRealtime(() => {
      loadData();
    });
    return () => {
      unsubscribe();
    };
  }, [loadData]);

  // Automated Watcher for Session Expiration (Supabase token expired or session timeout)
  useEffect(() => {
    const cleanupWatcher = setupSessionExpirationWatcher((reason: string) => {
      setCurrentUserState(null);
      setSessionExpiredReason(reason);
      if (activeTab === 'admin' || activeTab === 'voting') {
        setActiveTab('beranda');
      }
    });

    return () => {
      cleanupWatcher();
    };
  }, [activeTab]);

  // Activity Keep-Alive: Debounced touch session when logged-in user interacts
  useEffect(() => {
    if (!currentUser) return;

    let lastTouch = Date.now();
    const handleUserActivity = () => {
      // Refresh session TTL every 30 seconds upon active user interaction
      if (Date.now() - lastTouch > 30000) {
        lastTouch = Date.now();
        touchSession();
      }
    };

    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [currentUser]);

  // Calculate Quick Count Metrics
  const stats: QuickCountStats = calculateQuickCount(candidates, votes, users);

  // Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setShowLoginModal(false);
    setSessionExpiredReason(null);

    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      if (!user.sudah_memilih) {
        setActiveTab('voting');
      } else {
        // User already voted, show quick count or receipt
        setActiveTab('voting');
      }
    }
  };

  const handleLogout = async () => {
    await logoutUser('Pengguna keluar secara manual.');
    setCurrentUserState(null);
    if (activeTab === 'admin' || activeTab === 'voting') {
      setActiveTab('beranda');
    }
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    if (currentUser.role === 'admin') {
      alert('Akun Administrator hanya bertugas mengawasi pemilihan dan tidak memiliki hak suara siswa.');
      return;
    }

    if (currentUser.sudah_memilih) {
      // Show receipt
      const cand = candidates.find((c) => c.id === currentUser.voted_candidate_id) || candidate;
      const userVote = votes.find((v) => v.user_id === currentUser.id) || null;
      setReceiptData({
        vote: userVote,
        candidate: cand,
        user: currentUser,
      });
      return;
    }

    // Open confirmation modal
    setCandidateToConfirm(candidate);
  };

  const handleConfirmVote = async () => {
    if (!currentUser || !candidateToConfirm) return;

    setIsSubmittingVote(true);
    try {
      const res = await submitVote(currentUser.id, candidateToConfirm.id, true);
      if (res.success) {
        setCandidateToConfirm(null);
        setReceiptData({
          vote: res.vote || null,
          candidate: candidateToConfirm,
          user: { ...currentUser, sudah_memilih: true, voted_candidate_id: candidateToConfirm.id },
        });
        loadData();
      } else {
        alert(res.message);
        setCandidateToConfirm(null);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kendala saat merekam suara. Silakan coba kembali.');
    } finally {
      setIsSubmittingVote(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        isSupabaseActive={isSupabaseConfigured}
        settings={settings}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <div>
            {/* Hero Section matching requirements */}
            <HeroSection
              stats={stats}
              settings={settings}
              currentUser={currentUser}
              onStartVoting={() => {
                if (!currentUser) {
                  setShowLoginModal(true);
                } else {
                  setActiveTab('voting');
                }
              }}
              onViewQuickCount={() => setActiveTab('quickcount')}
              onViewBallot={() => setActiveTab('kartu-suara')}
              onViewRecap={() => setActiveTab('rekapitulasi')}
              onViewReport={() => setActiveTab('berita-acara')}
            />

            {/* Candidates Section */}
            <CandidatesSection
              candidates={candidates}
              currentUser={currentUser}
              onSelectCandidate={handleSelectCandidate}
              onViewDetails={(c) => setSelectedCandidateDetail(c)}
            />

            {/* Voting Flow Steps */}
            <VotingFlowSteps />
          </div>
        )}

        {activeTab === 'quickcount' && (
          <QuickCount
            stats={stats}
            candidates={candidates}
            votes={votes}
            users={users}
            onRefresh={loadData}
            isRealtimeActive={true}
          />
        )}

        {activeTab === 'kartu-suara' && (
          <PrintBallotCard
            candidates={candidates}
            users={users}
            settings={settings}
            onBack={() => setActiveTab('beranda')}
          />
        )}

        {activeTab === 'rekapitulasi' && (
          <RecapResults
            candidates={candidates}
            users={users}
            votes={votes}
            settings={settings}
            stats={stats}
            onBack={() => setActiveTab('beranda')}
          />
        )}

        {activeTab === 'berita-acara' && (
          <OfficialReport
            candidates={candidates}
            users={users}
            votes={votes}
            settings={settings}
            stats={stats}
            onBack={() => setActiveTab('beranda')}
          />
        )}

        {activeTab === 'voting' && (
          <VotingPage
            candidates={candidates}
            currentUser={currentUser}
            settings={settings}
            onSelectCandidate={handleSelectCandidate}
            onOpenLogin={() => setShowLoginModal(true)}
            onViewQuickCount={() => setActiveTab('quickcount')}
            onViewReceipt={() => {
              if (currentUser) {
                const cand = candidates.find((c) => c.id === currentUser.voted_candidate_id) || candidates[0];
                const userVote = votes.find((v) => v.user_id === currentUser.id) || null;
                setReceiptData({
                  vote: userVote,
                  candidate: cand,
                  user: currentUser,
                });
              }
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            candidates={candidates}
            users={users}
            votes={votes}
            settings={settings}
            stats={stats}
            currentUser={currentUser}
            onRefresh={loadData}
            onOpenSupabaseModal={() => setShowSupabaseModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} />

      {/* Modals & Dialogs */}
      {/* 1. Login Modal */}
      {showLoginModal && (
        <LoginPage
          users={users}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
          isModal={true}
        />
      )}

      {/* 2. Candidate Detail Modal */}
      {selectedCandidateDetail && (
        <CandidateDetailModal
          candidate={selectedCandidateDetail}
          currentUser={currentUser}
          onClose={() => setSelectedCandidateDetail(null)}
          onSelectCandidate={(cand) => {
            setSelectedCandidateDetail(null);
            handleSelectCandidate(cand);
          }}
        />
      )}

      {/* 3. Vote Confirmation Modal */}
      {candidateToConfirm && (
        <VoteConfirmModal
          candidate={candidateToConfirm}
          onConfirm={handleConfirmVote}
          onCancel={() => setCandidateToConfirm(null)}
          isSubmitting={isSubmittingVote}
        />
      )}

      {/* 4. Vote Success Digital Receipt Modal */}
      {receiptData && (
        <VoteReceiptModal
          vote={receiptData.vote}
          candidate={receiptData.candidate}
          user={receiptData.user}
          onClose={() => setReceiptData(null)}
          onViewQuickCount={() => {
            setReceiptData(null);
            setActiveTab('quickcount');
          }}
          settings={settings}
        />
      )}

      {/* 5. Supabase Config Modal */}
      {showSupabaseModal && (
        <SupabaseConfigModal
          onClose={() => setShowSupabaseModal(false)}
          onRefresh={loadData}
        />
      )}

      {/* 6. Session Expired Security Modal */}
      {sessionExpiredReason && (
        <SessionExpiredModal
          reason={sessionExpiredReason}
          onClose={() => setSessionExpiredReason(null)}
          onReLogin={() => {
            setSessionExpiredReason(null);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
}

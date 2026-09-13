import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Vote as VoteIcon,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Download,
  RotateCcw,
  Settings,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Save,
  Database,
  AlertTriangle,
  Lock,
  Building2,
  Printer,
  Award,
  FileCheck,
  FileText,
  Image as ImageIcon,
  UploadCloud,
} from 'lucide-react';
import { Candidate, ElectionSettings, QuickCountStats, User, Vote } from '../types';
import { exportToCSV, formatDateIndonesian } from '../lib/utils';
import { InstitutionSettings } from './InstitutionSettings';
import { PrintBallotCard } from './PrintBallotCard';
import { RecapResults } from './RecapResults';
import { OfficialReport } from './OfficialReport';
import {
  resetAllVotes,
  resetToInitialData,
  saveCandidates,
  saveSettings,
  saveUsers,
} from '../lib/supabase';

interface AdminDashboardProps {
  candidates: Candidate[];
  users: User[];
  votes: Vote[];
  settings: ElectionSettings;
  stats: QuickCountStats;
  currentUser: User | null;
  onRefresh: () => void;
  onOpenSupabaseModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  candidates,
  users,
  votes,
  settings,
  stats,
  currentUser,
  onRefresh,
  onOpenSupabaseModal,
}) => {
  const [adminTab, setAdminTab] = useState<
    | 'overview'
    | 'recap'
    | 'report'
    | 'ballot'
    | 'candidates'
    | 'voters'
    | 'institution'
    | 'logos'
    | 'settings'
  >('overview');

  // Candidate Editing State
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [candForm, setCandForm] = useState({
    nomor_urut: 1,
    nama_ketua: '',
    nama_wakil: '',
    kelas_ketua: '',
    kelas_wakil: '',
    tagline: '',
    foto: '',
    visi: '',
    misi: '',
  });

  // Voter Search & Filter State
  const [voterSearch, setVoterSearch] = useState('');
  const [voterFilterStatus, setVoterFilterStatus] = useState<'all' | 'voted' | 'unvoted'>('all');
  const [newVoterForm, setNewVoterForm] = useState({ nama: '', nisn: '', kelas: 'X-A' });
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);

  // Reset confirmation modals
  const [showResetVotesModal, setShowResetVotesModal] = useState(false);
  const [showFactoryResetModal, setShowFactoryResetModal] = useState(false);

  // Status message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export Voting Results to CSV/Excel
  const handleExportResults = () => {
    const rows = stats.candidateStats.map((item) => ({
      'Nomor Urut': item.candidate.nomor_urut,
      'Calon Ketua': item.candidate.nama_ketua,
      'Calon Wakil': item.candidate.nama_wakil,
      'Perolehan Suara': item.voteCount,
      'Persentase (%)': `${item.percentage}%`,
      Status: item.isLeading ? 'Memimpin' : 'Kompetitor',
    }));
    exportToCSV(`Hasil_Pemilihan_OSIS_${Date.now()}`, rows);
    showToast('Data hasil pemilihan berhasil diekspor ke format CSV/Excel.');
  };

  // Export Voter DPT List
  const handleExportVoters = () => {
    const rows = users
      .filter((u) => u.role === 'siswa')
      .map((u) => ({
        NISN: u.nisn,
        'Nama Siswa': u.nama,
        Kelas: u.kelas || '-',
        'Status Memilih': u.sudah_memilih ? 'SUDAH MEMILIH' : 'BELUM MEMILIH',
        'Waktu Memilih': u.voted_at ? formatDateIndonesian(u.voted_at) : '-',
      }));
    exportToCSV(`Daftar_DPT_OSIS_${Date.now()}`, rows);
    showToast('Data DPT pemilih berhasil diekspor.');
  };

  // Candidate Actions
  const handleOpenAddCandidate = () => {
    setIsAddingCandidate(true);
    setEditingCandidate(null);
    setCandForm({
      nomor_urut: candidates.length + 1,
      nama_ketua: '',
      nama_wakil: '',
      kelas_ketua: 'XI MIPA',
      kelas_wakil: 'X',
      tagline: '',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      visi: '',
      misi: 'Meningkatkan literasi dan prestasi siswa\nMempererat tali persaudaraan',
    });
  };

  const handleEditCandidate = (cand: Candidate) => {
    setEditingCandidate(cand);
    setIsAddingCandidate(false);
    setCandForm({
      nomor_urut: cand.nomor_urut,
      nama_ketua: cand.nama_ketua,
      nama_wakil: cand.nama_wakil,
      kelas_ketua: cand.kelas_ketua || '',
      kelas_wakil: cand.kelas_wakil || '',
      tagline: cand.tagline || '',
      foto: cand.foto,
      visi: cand.visi,
      misi: cand.misi.join('\n'),
    });
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const misiArray = candForm.misi
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);

    if (editingCandidate) {
      // Update
      const updated = candidates.map((c) => {
        if (c.id === editingCandidate.id) {
          return {
            ...c,
            nomor_urut: Number(candForm.nomor_urut),
            nama_ketua: candForm.nama_ketua,
            nama_wakil: candForm.nama_wakil,
            kelas_ketua: candForm.kelas_ketua,
            kelas_wakil: candForm.kelas_wakil,
            tagline: candForm.tagline,
            foto: candForm.foto,
            visi: candForm.visi,
            misi: misiArray,
          };
        }
        return c;
      });
      saveCandidates(updated);
      showToast('Data kandidat berhasil diperbarui.');
    } else {
      // Add
      const newCand: Candidate = {
        id: `cand-${Date.now()}`,
        nomor_urut: Number(candForm.nomor_urut),
        nama_ketua: candForm.nama_ketua,
        nama_wakil: candForm.nama_wakil,
        kelas_ketua: candForm.kelas_ketua,
        kelas_wakil: candForm.kelas_wakil,
        tagline: candForm.tagline,
        foto: candForm.foto,
        visi: candForm.visi,
        misi: misiArray,
        program_unggulan: ['Program Kerja Terpadu Kesiswaan'],
      };
      saveCandidates([...candidates, newCand]);
      showToast('Kandidat baru berhasil ditambahkan.');
    }

    setEditingCandidate(null);
    setIsAddingCandidate(false);
    onRefresh();
  };

  const handleDeleteCandidate = (candId: string) => {
    if (confirm('Yakin ingin menghapus paslon ini dari daftar kandidat?')) {
      const updated = candidates.filter((c) => c.id !== candId);
      saveCandidates(updated);
      showToast('Kandidat telah dihapus.');
      onRefresh();
    }
  };

  // Add new student voter
  const handleAddVoter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoterForm.nama.trim() || !newVoterForm.nisn.trim()) return;

    const exists = users.some((u) => u.nisn === newVoterForm.nisn.trim());
    if (exists) {
      alert('NISN sudah terdaftar sebelumnya!');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      nama: newVoterForm.nama.trim(),
      nisn: newVoterForm.nisn.trim(),
      role: 'siswa',
      sudah_memilih: false,
      kelas: newVoterForm.kelas,
    };

    saveUsers([...users, newUser]);
    setNewVoterForm({ nama: '', nisn: '', kelas: 'X-A' });
    setShowAddVoterModal(false);
    showToast(`Pemilih ${newUser.nama} berhasil ditambahkan ke DPT.`);
    onRefresh();
  };

  // Toggle Election Status
  const handleToggleElectionStatus = (newStatus: 'Sedang Berlangsung' | 'Ditutup') => {
    const updated: ElectionSettings = {
      ...settings,
      status: newStatus,
    };
    saveSettings(updated);
    showToast(`Status pemilihan diubah menjadi: ${newStatus}`);
    onRefresh();
  };

  // Filtered Voters
  const filteredVoters = users
    .filter((u) => u.role === 'siswa')
    .filter((u) => {
      const matchQuery =
        u.nama.toLowerCase().includes(voterSearch.toLowerCase()) ||
        u.nisn.toLowerCase().includes(voterSearch.toLowerCase()) ||
        (u.kelas && u.kelas.toLowerCase().includes(voterSearch.toLowerCase()));

      if (!matchQuery) return false;
      if (voterFilterStatus === 'voted') return u.sudah_memilih;
      if (voterFilterStatus === 'unvoted') return !u.sudah_memilih;
      return true;
    });

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in print:p-0 print:m-0 print:max-w-none print:space-y-0 print:bg-transparent">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print print:hidden fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header (Hidden in Print) */}
      <div className="no-print print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Panel Kontrol Administrator KPU
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Manajemen data kandidat, pemilih DPT, audit transparansi, dan rekapitulasi voting
              </p>
            </div>
          </div>
        </div>

        {/* Global Admin Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-admin-ballot-shortcut"
            onClick={() => setAdminTab('ballot')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'ballot'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kartu Suara</span>
          </button>

          <button
            id="btn-admin-recap-shortcut"
            onClick={() => setAdminTab('recap')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'recap'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Rekapitulasi Hasil</span>
          </button>

          <button
            id="btn-admin-report-shortcut"
            onClick={() => setAdminTab('report')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'report'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Berita Acara</span>
          </button>

          <button
            id="btn-admin-upload-logos"
            onClick={() => setAdminTab('logos')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'logos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Logo Kiri &amp; Kanan</span>
          </button>

          <button
            id="btn-admin-institution-shortcut"
            onClick={() => setAdminTab('institution')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'institution'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Seting Lembaga</span>
          </button>

          <button
            id="btn-admin-export-results"
            onClick={handleExportResults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Admin Subtabs (Hidden in Print) */}
      <div className="no-print print:hidden flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs sm:text-sm font-bold">
        <button
          id="tab-admin-overview"
          onClick={() => setAdminTab('overview')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Quick Count Visual</span>
        </button>

        <button
          id="tab-admin-ballot"
          onClick={() => setAdminTab('ballot')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'ballot'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Kartu Suara</span>
        </button>

        <button
          id="tab-admin-recap"
          onClick={() => setAdminTab('recap')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'recap'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rekapitulasi Hasil</span>
        </button>

        <button
          id="tab-admin-report"
          onClick={() => setAdminTab('report')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'report'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Berita Acara</span>
        </button>

        <button
          id="tab-admin-candidates"
          onClick={() => setAdminTab('candidates')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'candidates'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Paslon ({candidates.length})</span>
        </button>

        <button
          id="tab-admin-voters"
          onClick={() => setAdminTab('voters')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'voters'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <VoteIcon className="w-4 h-4" />
          <span>Daftar Pemilih ({users.filter((u) => u.role === 'siswa').length})</span>
        </button>

        <button
          id="tab-admin-institution"
          onClick={() => setAdminTab('institution')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'institution'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Seting Lembaga</span>
        </button>

        <button
          id="tab-admin-logos"
          onClick={() => setAdminTab('logos')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'logos'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Upload Logo Kiri &amp; Kanan</span>
        </button>

        <button
          id="tab-admin-settings"
          onClick={() => setAdminTab('settings')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            adminTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan &amp; Reset</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & HASIL */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Suara Masuk</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {stats.totalSuaraMasuk}
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Tingkat Partisipasi</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.persentasePartisipasi}%
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Belum Memilih</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
                {stats.totalBelumMemilih}
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Status Pemilihan</span>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                {settings.status}
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Rekapitulasi Suara Paslon
              </h3>
              <button
                onClick={handleExportResults}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Rekap Spreadsheet
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">No</th>
                    <th className="py-3 px-4">Kandidat Paslon</th>
                    <th className="py-3 px-4">Jumlah Suara</th>
                    <th className="py-3 px-4">Persentase</th>
                    <th className="py-3 px-4 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {stats.candidateStats.map((item) => (
                    <tr key={item.candidate.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        0{item.candidate.nomor_urut}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.candidate.nama_ketua}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Wakil: {item.candidate.nama_wakil}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {item.voteCount} suara
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                        {item.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        {item.isLeading ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                            Perolehan Tertinggi
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE CANDIDATES */}
      {adminTab === 'candidates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Daftar Pasangan Calon Terdaftar
            </h3>
            <button
              onClick={handleOpenAddCandidate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Paslon Baru</span>
            </button>
          </div>

          {/* Form Modal for Add/Edit */}
          {(isAddingCandidate || editingCandidate) && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-500 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingCandidate ? `Edit Paslon No. 0${editingCandidate.nomor_urut}` : 'Tambah Pasangan Calon Baru'}
                </h4>
                <button
                  onClick={() => {
                    setEditingCandidate(null);
                    setIsAddingCandidate(false);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Batal
                </button>
              </div>

              <form onSubmit={handleSaveCandidate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor Urut
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={candForm.nomor_urut}
                    onChange={(e) => setCandForm({ ...candForm, nomor_urut: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tagline Paslon
                  </label>
                  <input
                    type="text"
                    value={candForm.tagline}
                    onChange={(e) => setCandForm({ ...candForm, tagline: e.target.value })}
                    placeholder="Contoh: BERSATU & MAJU"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Calon Ketua
                  </label>
                  <input
                    type="text"
                    value={candForm.nama_ketua}
                    onChange={(e) => setCandForm({ ...candForm, nama_ketua: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Calon Wakil Ketua
                  </label>
                  <input
                    type="text"
                    value={candForm.nama_wakil}
                    onChange={(e) => setCandForm({ ...candForm, nama_wakil: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kelas Ketua
                  </label>
                  <input
                    type="text"
                    value={candForm.kelas_ketua}
                    onChange={(e) => setCandForm({ ...candForm, kelas_ketua: e.target.value })}
                    placeholder="XI MIPA 1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kelas Wakil
                  </label>
                  <input
                    type="text"
                    value={candForm.kelas_wakil}
                    onChange={(e) => setCandForm({ ...candForm, kelas_wakil: e.target.value })}
                    placeholder="X-B"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    URL Foto Kandidat
                  </label>
                  <input
                    type="text"
                    value={candForm.foto}
                    onChange={(e) => setCandForm({ ...candForm, foto: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Visi
                  </label>
                  <textarea
                    rows={2}
                    value={candForm.visi}
                    onChange={(e) => setCandForm({ ...candForm, visi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Misi (Satu baris per poin misi)
                  </label>
                  <textarea
                    rows={3}
                    value={candForm.misi}
                    onChange={(e) => setCandForm({ ...candForm, misi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCandidate(null);
                      setIsAddingCandidate(false);
                    }}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Simpan Data Paslon
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Candidates List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={c.foto}
                      alt={c.nama_ketua}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-xs">
                        No. 0{c.nomor_urut}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {c.nama_ketua}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        &amp; {c.nama_wakil}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic mb-4">
                    "{c.visi}"
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleEditCandidate(c)}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCandidate(c.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE VOTERS (DPT) */}
      {adminTab === 'voters' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Daftar Pemilih Tetap (DPT Siswa)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Memantau status partisipasi dan memastikan hak pilih digunakan tepat 1 kali
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportVoters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export DPT</span>
              </button>

              <button
                onClick={() => setShowAddVoterModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Siswa</span>
              </button>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa, NISN, atau kelas..."
                value={voterSearch}
                onChange={(e) => setVoterSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setVoterFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg ${voterFilterStatus === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : ''}`}
              >
                Semua ({users.filter((u) => u.role === 'siswa').length})
              </button>
              <button
                onClick={() => setVoterFilterStatus('voted')}
                className={`px-3 py-1.5 rounded-lg ${voterFilterStatus === 'voted' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : ''}`}
              >
                Sudah Vote ({users.filter((u) => u.role === 'siswa' && u.sudah_memilih).length})
              </button>
              <button
                onClick={() => setVoterFilterStatus('unvoted')}
                className={`px-3 py-1.5 rounded-lg ${voterFilterStatus === 'unvoted' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600' : ''}`}
              >
                Belum Vote ({users.filter((u) => u.role === 'siswa' && !u.sudah_memilih).length})
              </button>
            </div>
          </div>

          {/* Voters Table */}
          <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">NISN</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Status Pemilihan</th>
                  <th className="py-3 px-4">Waktu Suara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredVoters.map((voter) => (
                  <tr key={voter.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {voter.nisn}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {voter.nama}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {voter.kelas || 'Siswa'}
                    </td>
                    <td className="py-3 px-4">
                      {voter.sudah_memilih ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Sudah Memilih
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                          Belum Memilih
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {voter.voted_at ? formatDateIndonesian(voter.voted_at) : '-'}
                    </td>
                  </tr>
                ))}
                {filteredVoters.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      Tidak ada data pemilih yang cocok dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Voter Modal */}
          {showAddVoterModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Tambah Siswa ke DPT
                </h4>
                <form onSubmit={handleAddVoter} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Nama Lengkap Siswa
                    </label>
                    <input
                      type="text"
                      required
                      value={newVoterForm.nama}
                      onChange={(e) => setNewVoterForm({ ...newVoterForm, nama: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      NISN (10 Digit)
                    </label>
                    <input
                      type="text"
                      required
                      value={newVoterForm.nisn}
                      onChange={(e) => setNewVoterForm({ ...newVoterForm, nisn: e.target.value })}
                      placeholder="1029384799"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Kelas
                    </label>
                    <input
                      type="text"
                      value={newVoterForm.kelas}
                      onChange={(e) => setNewVoterForm({ ...newVoterForm, kelas: e.target.value })}
                      placeholder="XI MIPA 2"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddVoterModal(false)}
                      className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold"
                    >
                      Simpan Pemilih
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: CETAK KARTU SUARA & SURAT SUARA */}
      {adminTab === 'ballot' && (
        <PrintBallotCard
          candidates={candidates}
          users={users}
          settings={settings}
          onBack={() => setAdminTab('overview')}
        />
      )}

      {/* TAB: REKAPITULASI HASIL (MODEL C1) */}
      {adminTab === 'recap' && (
        <RecapResults
          candidates={candidates}
          users={users}
          votes={votes}
          settings={settings}
          stats={stats}
          onBack={() => setAdminTab('overview')}
        />
      )}

      {/* TAB: MENU BERITA ACARA RESMI */}
      {adminTab === 'report' && (
        <OfficialReport
          candidates={candidates}
          users={users}
          votes={votes}
          settings={settings}
          stats={stats}
          onBack={() => setAdminTab('overview')}
        />
      )}

      {/* TAB 4: INSTITUTION SETTINGS (SETING LEMBAGA) */}
      {adminTab === 'institution' && (
        <InstitutionSettings
          settings={settings}
          initialSection="profile"
          onSave={(updated) => {
            saveSettings(updated);
            showToast('Seting lembaga berhasil diperbarui!');
            onRefresh();
          }}
        />
      )}

      {/* TAB: UPLOAD LOGO KIRI & KANAN (DEDICATED MENU) */}
      {adminTab === 'logos' && (
        <InstitutionSettings
          settings={settings}
          initialSection="logos"
          onSave={(updated) => {
            saveSettings(updated);
            showToast('Logo kop surat dan data lembaga berhasil diperbarui!');
            onRefresh();
          }}
        />
      )}

      {/* TAB 5: SETTINGS & DANGEROUS ACTIONS */}
      {adminTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Status Periode Pemilihan
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleToggleElectionStatus('Sedang Berlangsung')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  settings.status === 'Sedang Berlangsung'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'border border-slate-300 text-slate-600 dark:text-slate-300'
                }`}
              >
                Buka Pemilihan (Sedang Berlangsung)
              </button>

              <button
                onClick={() => handleToggleElectionStatus('Ditutup')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  settings.status === 'Ditutup'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'border border-slate-300 text-slate-600 dark:text-slate-300'
                }`}
              >
                Tutup Bilik Suara (Selesai)
              </button>
            </div>
          </div>

          {/* Danger Zone: Reset Voting */}
          <div className="p-6 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <h4>Zona Bahaya (Reset Database Pemilihan)</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tindakan ini digunakan untuk mengosongkan kembali seluruh kotak suara (reset voting) sebelum pemilihan resmi dimulai, atau mengatur ulang seluruh sistem ke setelan bawaan.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetVotesModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Seluruh Perolehan Suara (0 Suara)</span>
              </button>

              <button
                onClick={() => setShowFactoryResetModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-400 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Reset ke Data Demo Awal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset Votes */}
      {showResetVotesModal && (
        <div className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-black text-lg text-slate-900 dark:text-white">
              Konfirmasi Reset Kotak Suara
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Apakah Anda yakin ingin menghapus semua suara yang telah masuk? Semua status pemilih akan dikembalikan menjadi "Belum Memilih". Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetVotesModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetAllVotes();
                  setShowResetVotesModal(false);
                  showToast('Kotak suara berhasil direset menjadi 0.');
                  onRefresh();
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Ya, Kosongkan Suara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Factory Reset */}
      {showFactoryResetModal && (
        <div className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-black text-lg text-slate-900 dark:text-white">
              Kembalikan ke Data Demo Awal?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Sistem akan memulihkan data kandidat 3 paslon resmi, akun siswa demo, dan rekap awal.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowFactoryResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetToInitialData();
                  setShowFactoryResetModal(false);
                  showToast('Data dikembalikan ke setelan awal.');
                  onRefresh();
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
              >
                Kembalikan Data Awal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

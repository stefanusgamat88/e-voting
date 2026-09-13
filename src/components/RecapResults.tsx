import React from 'react';
import {
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Award,
  CheckCircle2,
  Calendar,
  Users,
  Vote as VoteIcon,
  Percent,
  Download,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Candidate, ElectionSettings, QuickCountStats, User, Vote } from '../types';
import { exportToCSV, formatDateIndonesian } from '../lib/utils';

interface RecapResultsProps {
  candidates: Candidate[];
  users: User[];
  votes: Vote[];
  settings: ElectionSettings;
  stats: QuickCountStats;
  onBack?: () => void;
}

export const RecapResults: React.FC<RecapResultsProps> = ({
  candidates,
  users,
  votes,
  settings,
  stats,
  onBack,
}) => {
  const schoolName = settings.school_name || 'SMA NEGERI 1 TELADAN';
  const orgName = settings.organization_name || 'KOMISI PEMILIHAN UMUM OSIS & MPK';
  const schoolAddress = settings.school_address || 'Jl. Pemuda Pendidikan No. 45';
  const schoolCity = settings.school_city || 'Jakarta Selatan';
  const period = settings.period || 'Periode 2026/2027';
  const headmasterName = settings.headmaster_name || 'Drs. H. Bambang Sudirman, M.Pd.';
  const headmasterNip = settings.headmaster_nip || '19750812 200003 1 002';
  const kpuChairman = settings.kpu_chairman || 'Muhammad Rian Pratama';
  const kpuSecretary = settings.kpu_secretary || 'Anindya Larasati';

  // Perolehan Suara per paslon
  const results = candidates.map((candidate) => {
    const candidateVotes = votes.filter((v) => v.candidate_id === candidate.id).length;
    const percentage = votes.length > 0 ? ((candidateVotes / votes.length) * 100).toFixed(1) : '0.0';
    return {
      candidate,
      voteCount: candidateVotes,
      percentage: Number(percentage),
    };
  }).sort((a, b) => b.voteCount - a.voteCount);

  const winner = results[0]?.voteCount > 0 ? results[0] : null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const data = results.map((r, i) => ({
      'Peringkat': i + 1,
      'Nomor Urut': r.candidate.nomor_urut,
      'Nama Ketua': r.candidate.nama_ketua,
      'Nama Wakil': r.candidate.nama_wakil,
      'Jumlah Perolehan Suara': r.voteCount,
      'Persentase Suara (%)': `${r.percentage}%`,
    }));
    exportToCSV(`Rekapitulasi_Hasil_Pemilu_OSIS_${period.replace(/[^a-zA-Z0-9]/g, '')}`, data);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4 sm:px-6 print:min-h-0 print:bg-white print:p-0 print:m-0">
      <div className="max-w-5xl mx-auto space-y-6 print:max-w-none print:space-y-0 print:m-0 print:p-0">
        {/* Navigation & Toolbar (Hidden in Print) */}
        <div className="no-print print:hidden p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                <span>Rekapitulasi Hasil Pemilu (Formulir Model C1)</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Sertifikat dan berita rekapitulasi penghitungan perolehan suara resmi KPU OSIS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-export-recap-csv"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>

            <button
              id="btn-print-recap"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekapitulasi (A4 / PDF)</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL DOCUMENT (A4 FORM C1) */}
        <div className="bg-white text-slate-900 rounded-3xl shadow-xl border border-slate-300 print-page p-6 sm:p-10 font-sans space-y-6">
          {/* Official Kop Surat */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center relative">
            <div className="flex items-center justify-between gap-4">
              {/* Logo Kiri (Sekolah / Lembaga) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                {settings.school_logo_left || settings.school_logo ? (
                  <img
                    src={settings.school_logo_left || settings.school_logo}
                    alt="Logo Kiri Lembaga"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl">
                    OSIS
                  </div>
                )}
              </div>

              <div className="space-y-0.5 flex-1 text-center">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-slate-700">
                  {orgName}
                </h3>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight uppercase text-slate-900">
                  {schoolName}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  {schoolAddress}, {schoolCity} &bull; Website: {settings.website_url || 'sman1teladan.sch.id'}
                </p>
              </div>

              {/* Logo Kanan (OSIS / C1 Model) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                {settings.school_logo_right ? (
                  <img
                    src={settings.school_logo_right}
                    alt="Logo Kanan OSIS"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-slate-900 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold p-1 text-center">
                    <span className="font-mono text-xs">MODEL</span>
                    <span className="font-black text-sm text-blue-900">C1-OSIS</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-300">
              <h1 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-wide">
                SERTIFIKAT HASIL PENGHITUNGAN PEROLEHAN SUARA
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase">
                PEMILIHAN KETUA DAN WAKIL KETUA OSIS {period.toUpperCase()}
              </p>
            </div>
          </div>

          {/* I. DATA PEMILIH DAN PENGGUNAAN HAK PILIH */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider bg-slate-100 p-2 rounded border border-slate-300 text-slate-800">
              I. DATA PEMILIH DAN PENGGUNAAN HAK PILIH
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-300">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-3 text-left border-r border-slate-300">URAIAN DATA</th>
                    <th className="py-2 px-3 text-center border-r border-slate-300 w-28">JUMLAH</th>
                    <th className="py-2 px-3 text-center w-28">PERSENTASE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-300 font-semibold">
                      1. Jumlah Pemilih Terdaftar dalam DPT (Daftar Pemilih Tetap)
                    </td>
                    <td className="py-2 px-3 text-center font-bold font-mono border-r border-slate-300">
                      {stats.totalDPT}
                    </td>
                    <td className="py-2 px-3 text-center font-mono">100%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-300 font-semibold">
                      2. Jumlah Pemilih yang Menggunakan Hak Suara (Suara Masuk)
                    </td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-blue-900 border-r border-slate-300">
                      {stats.totalSuaraMasuk}
                    </td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-blue-900">
                      {stats.persentasePartisipasi}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border-r border-slate-300 font-semibold">
                      3. Jumlah Pemilih yang Belum / Tidak Menggunakan Hak Suara
                    </td>
                    <td className="py-2 px-3 text-center font-mono border-r border-slate-300">
                      {stats.totalBelumMemilih}
                    </td>
                    <td className="py-2 px-3 text-center font-mono">
                      {stats.totalDPT > 0 ? (100 - stats.persentasePartisipasi).toFixed(1) : '0.0'}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* II. RINCIAN PEROLEHAN SUARA PASANGAN CALON */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider bg-slate-100 p-2 rounded border border-slate-300 text-slate-800">
              II. RINCIAN PEROLEHAN SUARA MASING-MASING PASANGAN CALON
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-300">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-2 text-center border-r border-slate-300 w-12">NO</th>
                    <th className="py-2 px-3 text-left border-r border-slate-300">PASANGAN CALON (KETUA &amp; WAKIL)</th>
                    <th className="py-2 px-3 text-center border-r border-slate-300 w-32">PEROLEHAN SUARA</th>
                    <th className="py-2 px-3 text-center w-28">PERSENTASE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.map((res) => {
                    const isTop = winner && winner.candidate.id === res.candidate.id;
                    return (
                      <tr key={res.candidate.id} className={isTop ? 'bg-amber-50/70 font-semibold' : ''}>
                        <td className="py-3 px-2 text-center font-black text-sm border-r border-slate-300">
                          0{res.candidate.nomor_urut}
                        </td>
                        <td className="py-3 px-3 border-r border-slate-300">
                          <div className="flex items-center gap-3">
                            <img
                              src={res.candidate.foto}
                              alt={res.candidate.nama_ketua}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">
                                {res.candidate.nama_ketua} &bull; {res.candidate.nama_wakil}
                              </p>
                              <span className="text-[10px] text-slate-500">
                                Tagline: "{res.candidate.tagline || '-'}"
                              </span>
                            </div>
                            {isTop && (
                              <span className="ml-auto px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-black uppercase">
                                Terbanyak
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-black font-mono text-sm text-slate-900 border-r border-slate-300">
                          {res.voteCount} Suara
                        </td>
                        <td className="py-3 px-3 text-center font-black font-mono text-sm text-blue-900">
                          {res.percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={2} className="py-2 px-3 text-right border-r border-slate-300">
                      TOTAL SUARA SAH MASUK:
                    </td>
                    <td className="py-2 px-3 text-center font-black font-mono border-r border-slate-300">
                      {stats.totalVotes} Suara
                    </td>
                    <td className="py-2 px-3 text-center font-black font-mono">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* III. PENETAPAN PASANGAN CALON TERPILIH */}
          {winner && (
            <div className="p-4 rounded-2xl border-2 border-slate-900 bg-amber-50/60 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
                PENETAPAN PEROLEHAN SUARA TERTINGGI:
              </span>
              <h4 className="text-sm font-black text-slate-900">
                Pasangan Calon No. 0{winner.candidate.nomor_urut}: {winner.candidate.nama_ketua} &amp; {winner.candidate.nama_wakil}
              </h4>
              <p className="text-xs text-slate-700">
                Memperoleh dukungan suara terbanyak sejumlah <strong>{winner.voteCount} suara ({winner.percentage}%)</strong> dari total {stats.totalVotes} suara sah yang masuk.
              </p>
            </div>
          )}

          {/* IV. PENGESAHAN & TANDA TANGAN (SIGNATURE BLOCK) */}
          <div className="pt-4 border-t-2 border-slate-300 space-y-6 text-xs">
            <p className="text-right text-slate-600 text-[11px]">
              Ditetapkan di {schoolCity}, pada tanggal {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {/* Saksi Paslon 01 */}
              <div className="space-y-10">
                <p className="font-bold text-[11px] text-slate-700 uppercase">Saksi Paslon 01</p>
                <div className="pt-2 border-t border-slate-400">
                  <p className="font-bold text-[11px] uppercase">( ................................... )</p>
                </div>
              </div>

              {/* Saksi Paslon 02 */}
              <div className="space-y-10">
                <p className="font-bold text-[11px] text-slate-700 uppercase">Saksi Paslon 02</p>
                <div className="pt-2 border-t border-slate-400">
                  <p className="font-bold text-[11px] uppercase">( ................................... )</p>
                </div>
              </div>

              {/* Saksi Paslon 03 */}
              <div className="space-y-10">
                <p className="font-bold text-[11px] text-slate-700 uppercase">Saksi Paslon 03</p>
                <div className="pt-2 border-t border-slate-400">
                  <p className="font-bold text-[11px] uppercase">( ................................... )</p>
                </div>
              </div>

              {/* Sekretaris KPU */}
              <div className="space-y-10">
                <p className="font-bold text-[11px] text-slate-700 uppercase">Sekretaris KPU OSIS</p>
                <div className="pt-2 border-t border-slate-400">
                  <p className="font-black text-[11px] underline uppercase">{kpuSecretary}</p>
                </div>
              </div>
            </div>

            {/* Pimpinan / Penanggung Jawab */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 text-center">
              <div className="space-y-12">
                <p className="font-bold text-xs text-slate-800 uppercase">
                  Ketua Komisi Pemilihan Umum OSIS
                </p>
                <div className="pt-2 border-t border-slate-400 max-w-xs mx-auto">
                  <p className="font-black text-xs underline uppercase">{kpuChairman}</p>
                  <p className="text-[10px] text-slate-500">Penyelenggara Pemilihan</p>
                </div>
              </div>

              <div className="space-y-12">
                <p className="font-bold text-xs text-slate-800 uppercase">
                  Mengetahui, <br />
                  Kepala {schoolName}
                </p>
                <div className="pt-2 border-t border-slate-400 max-w-xs mx-auto">
                  <p className="font-black text-xs underline uppercase">{headmasterName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">NIP. {headmasterNip}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Hash */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>BERITA ACARA &amp; FORMULIR MODEL C1-OSIS ELEKTRONIK RESMI</span>
            <span>VERIFIED DIGITAL RECAP &bull; {new Date().toISOString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

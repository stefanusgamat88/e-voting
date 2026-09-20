import React, { useState } from 'react';
import {
  Printer,
  FileCheck,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Building2,
  Award,
  Edit3,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  MapPin,
  FileText,
} from 'lucide-react';
import { Candidate, ElectionSettings, QuickCountStats, User, Vote } from '../types';
import { formatElectionTimeRange } from '../lib/utils';

interface OfficialReportProps {
  candidates: Candidate[];
  users: User[];
  votes: Vote[];
  settings: ElectionSettings;
  stats: QuickCountStats;
  onBack?: () => void;
}

export const OfficialReport: React.FC<OfficialReportProps> = ({
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

  // Perolehan Suara & Pemenang
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

  // Editable fields for the official report
  const [docNumber, setDocNumber] = useState<string>(
    `007/BA-PLENO/KPU-OSIS/${new Date().getFullYear()}`
  );
  const [meetingLocation, setMeetingLocation] = useState<string>(
    `Bilik Suara Digital & Lab Komputer ${schoolName}`
  );
  const [specialNotes, setSpecialNotes] = useState<string>(
    'Pelaksanaan pemungutan dan penghitungan suara secara elektronik (e-voting) berlangsung dengan tertib, aman, jujur, transparan, dan adil. Tidak terdapat catatan keberatan dari para saksi pasangan calon.'
  );

  const [copied, setCopied] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textToCopy = `BERITA ACARA RAPAT PLENO REKAPITULASI HASIL PENGHITUNGAN SUARA
Nomor: ${docNumber}
Lembaga: ${schoolName}
Penyelenggara: ${orgName}
Hari/Tanggal: ${todayFormatted}
Rentang Waktu Pemilihan: ${formatElectionTimeRange(settings.start_date, settings.end_date)}
Tempat: ${meetingLocation}

HASIL PEROLEHAN SUARA:
${results
  .map(
    (r) =>
      `Paslon 0${r.candidate.nomor_urut} (${r.candidate.nama_ketua} & ${r.candidate.nama_wakil}): ${r.voteCount} Suara (${r.percentage}%)`
  )
  .join('\n')}

Ditetapkan Pasangan Calon Terpilih:
${winner ? `Paslon 0${winner.candidate.nomor_urut} (${winner.candidate.nama_ketua} & ${winner.candidate.nama_wakil})` : 'Belum Ditetapkan'}

Catatan Khusus:
${specialNotes}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4 sm:px-6 print:min-h-0 print:bg-white print:p-0 print:m-0">
      <div className="max-w-5xl mx-auto space-y-6 print:max-w-none print:space-y-0 print:m-0 print:p-0">
        {/* Navigation & Toolbar (Hidden in Print) */}
        <div className="no-print print:hidden p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <FileCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span>Menu Berita Acara Resmi Pemilu OSIS</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Dokumen Berita Acara Rapat Pleno Rekapitulasi dan Penetapan Paslon Terpilih format resmi A4.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-copy-report-text"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              id="btn-print-official-report"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Berita Acara (A4 / PDF)</span>
            </button>
          </div>
        </div>

        {/* Form Editor Mini Panel (Hidden in Print) */}
        <div className="no-print print:hidden p-4 sm:p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-200">
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Kustomisasi Nomor Dokumen &amp; Lokasi Rapat Pleno:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Nomor Surat Berita Acara:
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tempat Pelaksanaan Rapat Pleno:
              </label>
              <input
                type="text"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Catatan Kejadian Khusus / Keterangan Saksi:
              </label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL DOCUMENT (A4 BERITA ACARA RESMI) */}
        <div className="bg-white text-slate-900 rounded-3xl shadow-xl border border-slate-300 print-page p-6 sm:p-10 font-serif space-y-6">
          {/* Kop Surat Berita Acara */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center relative font-sans">
            <div className="flex items-center justify-between gap-4">
              {/* Logo Kiri (Sekolah / Lambang Lembaga) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                {settings.school_logo_left || settings.school_logo ? (
                  <img
                    src={settings.school_logo_left || settings.school_logo}
                    alt="Logo Kiri Lembaga"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl font-sans">
                    OSIS
                  </div>
                )}
              </div>

              <div className="space-y-0.5 flex-1 text-center font-sans">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-slate-700">
                  {orgName}
                </h3>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight uppercase text-slate-900">
                  {schoolName}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  {schoolAddress}, {schoolCity} &bull; Email: {settings.contact_email || 'osis@sman1teladan.sch.id'}
                </p>
              </div>

              {/* Logo Kanan (OSIS / MPK / KPU) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                {settings.school_logo_right ? (
                  <img
                    src={settings.school_logo_right}
                    alt="Logo Kanan OSIS"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-slate-900 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold p-1 text-center font-sans">
                    <FileText className="w-8 h-8 text-slate-900 mb-0.5" />
                    <span>PLENO</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-300">
              <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide font-sans">
                BERITA ACARA RAPAT PLENO REKAPITULASI HASIL PENGHITUNGAN SUARA
              </h1>
              <h2 className="text-sm font-bold text-slate-800 uppercase font-sans">
                PEMILIHAN KETUA DAN WAKIL KETUA OSIS {period.toUpperCase()}
              </h2>
              <p className="text-xs font-mono font-bold text-slate-600 mt-1 font-sans">
                NOMOR: {docNumber}
              </p>
            </div>
          </div>

          {/* Prologue Paragraph */}
          <div className="text-xs sm:text-sm leading-relaxed text-slate-800 text-justify space-y-3">
            <p>
              Pada hari ini <strong>{todayFormatted}</strong>, bertempat di <strong>{meetingLocation}</strong>, 
              Komisi Pemilihan Umum Organisasi Siswa Intra Sekolah ({orgName}) telah melaksanakan 
              <strong> Rapat Pleno Terbuka Rekapitulasi Hasil Pemungutan dan Penghitungan Suara </strong> 
              Pemilihan Ketua dan Wakil Ketua OSIS {schoolName} {period} yang diselenggarakan pada rentang waktu <strong>{formatElectionTimeRange(settings.start_date, settings.end_date)}</strong>.
            </p>
            <p>
              Rapat Pleno Terbuka ini dihadiri oleh Komisioner KPU OSIS, Panitia Pengawas Pemilihan, Saksi Pasangan Calon, 
              serta Pembina OSIS, dengan rincian hasil pemungutan suara sebagai berikut:
            </p>
          </div>

          {/* Table of Vote Results */}
          <div className="space-y-2 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 p-2 rounded border border-slate-300">
              A. PEROLEHAN SUARA RESMI PASANGAN CALON
            </h4>
            <table className="w-full text-xs border border-slate-300">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2 px-2 text-center border-r border-slate-300 w-12">NO</th>
                  <th className="py-2 px-3 text-left border-r border-slate-300">NAMA PASANGAN CALON</th>
                  <th className="py-2 px-3 text-center border-r border-slate-300 w-32">PEROLEHAN SUARA</th>
                  <th className="py-2 px-3 text-center w-28">PERSENTASE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {results.map((res) => (
                  <tr key={res.candidate.id}>
                    <td className="py-2 px-2 text-center font-black border-r border-slate-300">
                      0{res.candidate.nomor_urut}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 font-semibold">
                      {res.candidate.nama_ketua} &amp; {res.candidate.nama_wakil}
                    </td>
                    <td className="py-2 px-3 text-center font-bold font-mono border-r border-slate-300">
                      {res.voteCount} Suara
                    </td>
                    <td className="py-2 px-3 text-center font-bold font-mono">
                      {res.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="py-2 px-3 text-right border-r border-slate-300">
                    TOTAL SUARA SAH MASUK (PARTISIPASI {stats.persentasePartisipasi}%):
                  </td>
                  <td className="py-2 px-3 text-center font-mono border-r border-slate-300">
                    {stats.totalSuaraMasuk} Suara
                  </td>
                  <td className="py-2 px-3 text-center font-mono">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Diktum Penetapan Paslon Terpilih */}
          <div className="space-y-2 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 p-2 rounded border border-slate-300">
              B. PENETAPAN PASANGAN CALON TERPILIH
            </h4>
            {winner ? (
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm leading-relaxed space-y-1">
                <p>
                  Berdasarkan hasil rekapitulasi suara di atas, Komisi Pemilihan Umum OSIS menetapkan bahwa pasangan calon:
                </p>
                <p className="font-black text-slate-900 text-sm sm:text-base pt-1">
                  Nomor Urut 0{winner.candidate.nomor_urut}: {winner.candidate.nama_ketua} &amp; {winner.candidate.nama_wakil}
                </p>
                <p className="text-xs text-slate-700">
                  Dinyatakan sebagai <strong>KETUA DAN WAKIL KETUA OSIS TERPILIH</strong> {schoolName} {period}.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-600">
                Pemilihan suara masih berlangsung atau belum terdapat suara yang masuk.
              </div>
            )}
          </div>

          {/* Catatan Khusus */}
          <div className="space-y-2 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 p-2 rounded border border-slate-300">
              C. CATATAN KEJADIAN KHUSUS / KEBERATAN SAKSI
            </h4>
            <div className="p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs italic text-slate-700 leading-relaxed">
              "{specialNotes}"
            </div>
          </div>

          {/* Penutup Berita Acara */}
          <div className="text-xs text-slate-800 leading-relaxed text-justify pt-2">
            <p>
              Demikian Berita Acara ini dibuat dan ditandatangani oleh Komisi Pemilihan Umum OSIS, para Saksi Pasangan Calon, 
              serta disahkan oleh Pimpinan Sekolah untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* Lembar Tanda Tangan Komplit */}
          <div className="pt-6 border-t-2 border-slate-300 space-y-6 text-xs font-sans">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="space-y-10">
                <p className="font-bold text-[11px] text-slate-700 uppercase">Saksi Paslon 01</p>
                <div className="pt-2 border-t border-slate-400">
                  <p className="font-bold text-[11px] uppercase">( ................................... )</p>
                </div>
              </div>

              <div className="space-y-10">
                <p className="font-bold text-[11px] text-slate-700 uppercase">Saksi Paslon 02</p>
                <div className="pt-2 border-t border-slate-400">
                  <p className="font-bold text-[11px] uppercase">( ................................... )</p>
                </div>
              </div>

              <div className="space-y-10">
                <p className="font-bold text-[11px] text-slate-700 uppercase">Saksi Paslon 03</p>
                <div className="pt-2 border-t border-slate-400">
                  <p className="font-bold text-[11px] uppercase">( ................................... )</p>
                </div>
              </div>

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
                  Mengetahui &amp; Mengesahkan, <br />
                  Kepala {schoolName}
                </p>
                <div className="pt-2 border-t border-slate-400 max-w-xs mx-auto">
                  <p className="font-black text-xs underline uppercase">{headmasterName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">NIP. {headmasterNip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

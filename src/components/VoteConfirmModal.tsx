import React, { useState } from 'react';
import { Candidate } from '../types';
import { AlertCircle, CheckCircle2, ShieldCheck, MapPin, X } from 'lucide-react';

interface VoteConfirmModalProps {
  candidate: Candidate | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const VoteConfirmModal: React.FC<VoteConfirmModalProps> = ({
  candidate,
  onConfirm,
  onCancel,
  isSubmitting,
}) => {
  const [agreementChecked, setAgreementChecked] = useState(false);

  if (!candidate) return null;

  const nomorFormatted = candidate.nomor_urut < 10 ? `0${candidate.nomor_urut}` : candidate.nomor_urut;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Konfirmasi Pilihan Suara
          </h3>
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
            “Apakah Anda yakin memilih kandidat ini?”
          </p>
        </div>

        {/* Selected Candidate Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={candidate.foto}
              alt={candidate.nama_ketua}
              className="w-16 h-16 rounded-xl object-cover object-top border border-slate-200 dark:border-slate-700"
            />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shadow">
              {nomorFormatted}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Pasangan Calon No. Urut {nomorFormatted}
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {candidate.nama_ketua}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              &amp; {candidate.nama_wakil}
            </p>
          </div>
        </div>

        {/* Anti-Double Vote Warning */}
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Peringatan Penting Anti-Double Vote</span>
          </div>
          <p className="leading-relaxed">
            Pilihan Anda bersifat <strong>mutlak dan langsung dienkripsi</strong>. Setelah suara diberikan, akun NISN Anda tidak dapat digunakan untuk memilih kembali.
          </p>
        </div>

        {/* Verification Checkbox */}
        <label className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 select-none cursor-pointer pt-1">
          <input
            id="checkbox-confirm-agreement"
            type="checkbox"
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
          <span>
            Saya menyatakan dengan sungguh-sungguh bahwa pilihan ini diambil secara bebas, jujur, dan atas kehendak saya sendiri tanpa paksaan dari pihak mana pun.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            id="btn-cancel-vote"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal / Ganti Pilihan
          </button>
          <button
            id="btn-confirm-submit-vote"
            onClick={onConfirm}
            disabled={!agreementChecked || isSubmitting}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              agreementChecked && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Merekam Suara...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Ya, Berikan Suara</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

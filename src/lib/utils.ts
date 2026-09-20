export function formatDateIndonesian(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatTimeShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatElectionTimeRange(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return 'Waktu pemilihan belum diatur';

  const formatSingle = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return (
        new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(d) + ' WIB'
      );
    } catch {
      return dateStr;
    }
  };

  if (startDate && endDate) {
    return `${formatSingle(startDate)} s/d ${formatSingle(endDate)}`;
  }
  if (startDate) return `Mulai: ${formatSingle(startDate)}`;
  return `Selesai: ${formatSingle(endDate!)}`;
}

export function getElectionScheduleStatus(
  startDate?: string,
  endDate?: string,
  manualStatus?: string
): {
  status: 'upcoming' | 'ongoing' | 'ended';
  label: string;
  badgeClass: string;
  timeRemaining?: string;
} {
  const now = new Date().getTime();
  const start = startDate ? new Date(startDate).getTime() : null;
  const end = endDate ? new Date(endDate).getTime() : null;

  if (manualStatus === 'Ditutup') {
    return {
      status: 'ended',
      label: 'Pemilihan Ditutup',
      badgeClass:
        'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-900',
    };
  }

  if (manualStatus === 'Belum Dimulai') {
    return {
      status: 'upcoming',
      label: 'Belum Dimulai',
      badgeClass:
        'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-900',
    };
  }

  if (start && !isNaN(start) && now < start) {
    const diffMs = start - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const timeRemaining =
      diffHours >= 24
        ? `${Math.floor(diffHours / 24)} hari lagi`
        : `${diffHours} jam ${diffMins} menit lagi`;

    return {
      status: 'upcoming',
      label: `Belum Dimulai (${timeRemaining})`,
      badgeClass:
        'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-900',
      timeRemaining,
    };
  }

  if (end && !isNaN(end) && now > end) {
    return {
      status: 'ended',
      label: 'Waktu Pemilihan Berakhir',
      badgeClass:
        'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-900',
    };
  }

  if (end && !isNaN(end) && now <= end) {
    const diffMs = end - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const timeRemaining =
      diffHours >= 24
        ? `${Math.floor(diffHours / 24)} hari ${diffHours % 24} jam`
        : `${diffHours} jam ${diffMins} menit`;

    return {
      status: 'ongoing',
      label: `Sedang Berlangsung (Sisa: ${timeRemaining})`,
      badgeClass:
        'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-900',
      timeRemaining,
    };
  }

  return {
    status: 'ongoing',
    label: manualStatus || 'Sedang Berlangsung',
    badgeClass:
      'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-900',
  };
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  status: 'upcoming' | 'ongoing' | 'ended';
  percentageElapsed: number; // 0 to 100
  title: string;
}

export function calculateElectionCountdown(
  startDate?: string,
  endDate?: string,
  manualStatus?: string
): CountdownTime {
  const now = Date.now();
  const start = startDate ? new Date(startDate).getTime() : null;
  const end = endDate ? new Date(endDate).getTime() : null;

  if (manualStatus === 'Ditutup' || (end && !isNaN(end) && now >= end)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      status: 'ended',
      percentageElapsed: 100,
      title: 'Pemilihan Telah Ditutup',
    };
  }

  if (manualStatus === 'Belum Dimulai' || (start && !isNaN(start) && now < start)) {
    const diff = Math.max(0, (start || now) - now);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      isExpired: false,
      status: 'upcoming',
      percentageElapsed: 0,
      title: 'Menuju Pembukaan Bilik Suara',
    };
  }

  if (end && !isNaN(end) && now < end) {
    const diff = Math.max(0, end - now);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let percentageElapsed = 0;
    if (start && !isNaN(start) && end > start) {
      const total = end - start;
      const elapsed = now - start;
      percentageElapsed = Math.min(100, Math.max(0, (elapsed / total) * 100));
    }

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      isExpired: false,
      status: 'ongoing',
      percentageElapsed,
      title: 'Sisa Waktu Menuju Penutupan Bilik Suara',
    };
  }

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isExpired: false,
    status: 'ongoing',
    percentageElapsed: 0,
    title: 'Pemilihan Sedang Berlangsung',
  };
}

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

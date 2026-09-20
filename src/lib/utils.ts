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

export interface Candidate {
  id: string;
  nomor_urut: number;
  nama_ketua: string;
  nama_wakil: string;
  foto: string;
  visi: string;
  misi: string[];
  tagline?: string;
  program_unggulan?: string[];
  kelas_ketua?: string;
  kelas_wakil?: string;
}

export interface User {
  id: string;
  nama: string;
  nisn: string;
  role: 'admin' | 'siswa';
  sudah_memilih: boolean;
  kelas?: string;
  email?: string;
  voted_at?: string;
  voted_candidate_id?: string;
}

export interface Vote {
  id: string;
  user_id: string;
  candidate_id: string;
  timestamp: string;
  location_verified?: boolean;
  hash?: string;
}

export interface ElectionSettings {
  title: string;
  school_name: string;
  period: string;
  status: 'Sedang Berlangsung' | 'Ditutup' | 'Belum Dimulai';
  start_date: string;
  end_date: string;
  allow_geolocation: boolean;
  school_coordinates?: {
    lat: number;
    lng: number;
    radius_meters: number;
  };
  // Setting Lembaga (Institution Settings)
  school_logo?: string;
  organization_name?: string;
  school_address?: string;
  school_city?: string;
  school_province?: string;
  headmaster_name?: string;
  headmaster_nip?: string;
  kpu_chairman?: string;
  kpu_secretary?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
}

export interface QuickCountStats {
  totalDPT: number;
  totalSuaraMasuk: number;
  totalBelumMemilih: number;
  persentasePartisipasi: number;
  candidateStats: {
    candidate: Candidate;
    voteCount: number;
    percentage: number;
    isLeading: boolean;
  }[];
}

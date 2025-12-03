export type UserRole = 'staff' | 'trustee' | 'founder';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isHigherAuthority?: boolean;
  createdAt: Date;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  dateOfBirth: Date;
  memoNumber: string;
  aadharNumber?: string;
  guardianName: string;
  guardianSignature?: string;
  photoUrl?: string;
  fingerprintUrl?: string;
  admissionDate: Date;
  status: 'admitted' | 'deceased';
  deathDate?: Date;
  deathReason?: string;
  isAdmissionCommitted: boolean;
  isDeathCommitted?: boolean;
  committedBy?: string;
  createdBy: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  documentUrl: string;
  documentName: string;
  notes?: string;
  uploadedBy: string;
  uploadedAt: Date;
  isCommitted: boolean;
  committedBy?: string;
  committedAt?: Date;
}

export interface DashboardStats {
  totalAdmissions: number;
  admissionsLast28Days: number;
  totalDeaths: number;
  deathsLast28Days: number;
  pendingCommitments: number;
}

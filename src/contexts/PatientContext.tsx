import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, HealthRecord, DashboardStats } from '@/types';

interface PatientContextType {
  patients: Patient[];
  healthRecords: HealthRecord[];
  stats: DashboardStats;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  registerDeath: (patientId: string, deathDate: Date, reason: string) => void;
  commitAdmission: (patientId: string, userId: string) => void;
  commitDeath: (patientId: string, userId: string) => void;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  commitHealthRecord: (recordId: string, userId: string) => void;
  getPatientById: (id: string) => Patient | undefined;
  searchPatients: (query: string, searchType: 'name' | 'age' | 'admissionDate' | 'deathDate') => Patient[];
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Mock initial data
const initialPatients: Patient[] = [
  {
    id: '1',
    name: 'Venkatesh Rao',
    age: 78,
    dateOfBirth: new Date('1946-03-15'),
    memoNumber: 'MEM001',
    aadharNumber: '1234-5678-9012',
    guardianName: 'Suresh Rao',
    admissionDate: new Date('2024-01-10'),
    status: 'admitted',
    isAdmissionCommitted: true,
    createdBy: '3',
  },
  {
    id: '2',
    name: 'Kamala Devi',
    age: 82,
    dateOfBirth: new Date('1942-07-22'),
    memoNumber: 'MEM002',
    guardianName: 'Prakash Kumar',
    admissionDate: new Date('2024-02-20'),
    status: 'admitted',
    isAdmissionCommitted: true,
    createdBy: '3',
  },
  {
    id: '3',
    name: 'Gopal Krishna',
    age: 75,
    dateOfBirth: new Date('1949-11-05'),
    memoNumber: 'MEM003',
    aadharNumber: '9876-5432-1098',
    guardianName: 'Meena Kumari',
    admissionDate: new Date('2024-03-05'),
    status: 'deceased',
    deathDate: new Date('2024-10-15'),
    deathReason: 'Natural causes',
    isAdmissionCommitted: true,
    isDeathCommitted: true,
    createdBy: '4',
  },
  {
    id: '4',
    name: 'Saraswati Bai',
    age: 80,
    dateOfBirth: new Date('1944-09-18'),
    memoNumber: 'MEM004',
    guardianName: 'Raman Pillai',
    admissionDate: new Date('2024-11-01'),
    status: 'admitted',
    isAdmissionCommitted: false,
    createdBy: '3',
  },
  {
    id: '5',
    name: 'Narasimha Murthy',
    age: 85,
    dateOfBirth: new Date('1939-04-12'),
    memoNumber: 'MEM005',
    guardianName: 'Lakshmi Narayan',
    admissionDate: new Date('2024-11-10'),
    status: 'admitted',
    isAdmissionCommitted: false,
    createdBy: '4',
  },
];

const initialHealthRecords: HealthRecord[] = [
  {
    id: '1',
    patientId: '1',
    documentUrl: '/documents/health1.pdf',
    documentName: 'Monthly Checkup Report',
    notes: 'Blood pressure stable, sugar levels normal',
    uploadedBy: '3',
    uploadedAt: new Date('2024-11-01'),
    isCommitted: true,
    committedBy: '3',
    committedAt: new Date('2024-11-02'),
  },
  {
    id: '2',
    patientId: '2',
    documentUrl: '/documents/health2.pdf',
    documentName: 'Cardiology Report',
    notes: 'Heart function normal for age',
    uploadedBy: '4',
    uploadedAt: new Date('2024-11-05'),
    isCommitted: false,
  },
];

function calculateStats(patients: Patient[]): DashboardStats {
  const now = new Date();
  const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

  const totalAdmissions = patients.length;
  const admissionsLast28Days = patients.filter(
    (p) => new Date(p.admissionDate) >= twentyEightDaysAgo
  ).length;
  const totalDeaths = patients.filter((p) => p.status === 'deceased').length;
  const deathsLast28Days = patients.filter(
    (p) => p.status === 'deceased' && p.deathDate && new Date(p.deathDate) >= twentyEightDaysAgo
  ).length;
  const pendingCommitments = patients.filter(
    (p) => !p.isAdmissionCommitted || (p.status === 'deceased' && !p.isDeathCommitted)
  ).length;

  return { totalAdmissions, admissionsLast28Days, totalDeaths, deathsLast28Days, pendingCommitments };
}

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealthRecords);

  const stats = calculateStats(patients);

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
    };
    setPatients((prev) => [...prev, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const registerDeath = (patientId: string, deathDate: Date, reason: string) => {
    updatePatient(patientId, {
      status: 'deceased',
      deathDate,
      deathReason: reason,
      isDeathCommitted: false,
    });
  };

  const commitAdmission = (patientId: string, userId: string) => {
    updatePatient(patientId, {
      isAdmissionCommitted: true,
      committedBy: userId,
    });
  };

  const commitDeath = (patientId: string, userId: string) => {
    updatePatient(patientId, {
      isDeathCommitted: true,
      committedBy: userId,
    });
  };

  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setHealthRecords((prev) => [...prev, newRecord]);
  };

  const commitHealthRecord = (recordId: string, userId: string) => {
    setHealthRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, isCommitted: true, committedBy: userId, committedAt: new Date() }
          : r
      )
    );
  };

  const getPatientById = (id: string) => patients.find((p) => p.id === id);

  const searchPatients = (query: string, searchType: 'name' | 'age' | 'admissionDate' | 'deathDate'): Patient[] => {
    if (!query) return patients;

    switch (searchType) {
      case 'name':
        return patients.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
      case 'age':
        const age = parseInt(query);
        return patients.filter((p) => p.age === age);
      case 'admissionDate':
        const admDate = new Date(query);
        return patients.filter(
          (p) => new Date(p.admissionDate) >= admDate
        );
      case 'deathDate':
        const deathDate = new Date(query);
        return patients.filter(
          (p) => p.status === 'deceased' && p.deathDate && new Date(p.deathDate) >= deathDate
        );
      default:
        return patients;
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        healthRecords,
        stats,
        addPatient,
        updatePatient,
        registerDeath,
        commitAdmission,
        commitDeath,
        addHealthRecord,
        commitHealthRecord,
        getPatientById,
        searchPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}

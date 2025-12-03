import { useState } from 'react';
import { usePatients } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, User, Calendar, FileText, X, Heart, Fingerprint, Camera } from 'lucide-react';
import { Patient } from '@/types';

export default function SearchPatients() {
  const { patients, healthRecords } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'age' | 'admissionDate' | 'deathDate'>('name');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const searchPatients = () => {
    if (!searchQuery) return patients;

    switch (searchType) {
      case 'name':
        return patients.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'age':
        const age = parseInt(searchQuery);
        return patients.filter((p) => p.age === age);
      case 'admissionDate':
        const admDate = new Date(searchQuery);
        return patients.filter((p) => new Date(p.admissionDate) >= admDate);
      case 'deathDate':
        const deathDate = new Date(searchQuery);
        return patients.filter(
          (p) => p.status === 'deceased' && p.deathDate && new Date(p.deathDate) >= deathDate
        );
      default:
        return patients;
    }
  };

  const filteredPatients = searchPatients();
  const patientHealthRecords = selectedPatient
    ? healthRecords.filter((r) => r.patientId === selectedPatient.id)
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Search className="w-5 h-5 text-secondary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Search Patients</h1>
        </div>
        <p className="text-muted-foreground">
          Find and view patient records
        </p>
      </div>

      {/* Search Controls */}
      <div className="form-section">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label>Search Type</Label>
            <Select value={searchType} onValueChange={(v: typeof searchType) => setSearchType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">By Name</SelectItem>
                <SelectItem value="age">By Age</SelectItem>
                <SelectItem value="admissionDate">By Admission Date (After)</SelectItem>
                <SelectItem value="deathDate">By Death Date (After)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-[2] space-y-2">
            <Label>Search Query</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={searchType.includes('Date') ? 'date' : searchType === 'age' ? 'number' : 'text'}
                placeholder={
                  searchType === 'name'
                    ? 'Enter patient name...'
                    : searchType === 'age'
                    ? 'Enter age...'
                    : 'Select date...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">
            Results ({filteredPatients.length})
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No patients found</p>
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedPatient?.id === patient.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Age: {patient.age} • Memo: {patient.memoNumber}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        patient.status === 'admitted'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {patient.status === 'admitted' ? 'Admitted' : 'Deceased'}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Patient Details */}
        <div className="form-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Patient Details</h2>
            {selectedPatient && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPatient(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {selectedPatient ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
                  {selectedPatient.photoUrl ? (
                    <img
                      src={selectedPatient.photoUrl}
                      alt={selectedPatient.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedPatient.age} years old
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                      selectedPatient.status === 'admitted'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {selectedPatient.status === 'admitted' ? 'Currently Admitted' : 'Deceased'}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Memo Number</p>
                  <p className="text-sm font-medium">{selectedPatient.memoNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Aadhar Number</p>
                  <p className="text-sm font-medium">
                    {selectedPatient.aadharNumber || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Admission Date</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedPatient.admissionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Guardian Name</p>
                  <p className="text-sm font-medium">{selectedPatient.guardianName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Admission Status</p>
                  <p className="text-sm font-medium">
                    {selectedPatient.isAdmissionCommitted ? 'Committed' : 'Pending'}
                  </p>
                </div>
              </div>

              {/* Death Info (if applicable) */}
              {selectedPatient.status === 'deceased' && (
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <p className="font-medium text-sm">Death Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Date of Death</p>
                      <p className="text-sm">
                        {selectedPatient.deathDate &&
                          new Date(selectedPatient.deathDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Reason</p>
                      <p className="text-sm">{selectedPatient.deathReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Health Records */}
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-destructive" />
                  Health Records ({patientHealthRecords.length})
                </h4>
                {patientHealthRecords.length > 0 ? (
                  <div className="space-y-2">
                    {patientHealthRecords.map((record) => (
                      <div
                        key={record.id}
                        className="p-3 rounded-lg border border-border bg-background"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <p className="text-sm font-medium">{record.documentName}</p>
                        </div>
                        {record.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{record.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(record.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No health records available</p>
                )}
              </div>

              {/* Documents */}
              <div className="flex gap-3">
                {selectedPatient.fingerprintUrl && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                    <Fingerprint className="w-4 h-4 text-success" />
                    <span className="text-sm">Fingerprint on file</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <User className="w-16 h-16 mb-4 opacity-50" />
              <p>Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

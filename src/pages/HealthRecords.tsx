import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Heart, Upload, Search, CheckCircle, Clock, FileText } from 'lucide-react';

export default function HealthRecords() {
  const { user } = useAuth();
  const { patients, healthRecords, addHealthRecord, commitHealthRecord } = usePatients();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const admittedPatients = patients.filter((p) => p.status === 'admitted');
  const filteredPatients = admittedPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCommit = user?.role === 'founder' || (user?.role === 'staff' && user?.isHigherAuthority);
  const patientRecords = selectedPatient
    ? healthRecords.filter((r) => r.patientId === selectedPatient)
    : [];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !documentFile) return;

    setIsSubmitting(true);

    try {
      addHealthRecord({
        patientId: selectedPatient,
        documentUrl: URL.createObjectURL(documentFile),
        documentName: documentFile.name,
        notes: notes || undefined,
        uploadedBy: user?.id || '',
        uploadedAt: new Date(),
        isCommitted: false,
      });

      toast({
        title: 'Health Record Uploaded',
        description: 'The document has been uploaded successfully.',
      });

      setDocumentFile(null);
      setNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload health record.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommit = (recordId: string) => {
    commitHealthRecord(recordId, user?.id || '');
    toast({
      title: 'Record Committed',
      description: 'The health record has been approved.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Health Records</h1>
        </div>
        <p className="text-muted-foreground">
          Upload and manage patient health documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">Select Patient</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPatient(p.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedPatient === p.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Age: {p.age}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
          
          {selectedPatient ? (
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label>Health Document</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                  {documentFile ? (
                    <div className="space-y-2">
                      <FileText className="w-10 h-10 mx-auto text-primary" />
                      <p className="text-sm font-medium">{documentFile.name}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDocumentFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload document
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Images, or Documents
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this health record..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={!documentFile || isSubmitting}
              >
                {isSubmitting ? 'Uploading...' : 'Upload Record'}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Heart className="w-12 h-12 mb-3 opacity-50" />
              <p>Select a patient first</p>
            </div>
          )}
        </div>

        {/* Records List */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">Patient Records</h2>
          
          {selectedPatient ? (
            patientRecords.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {patientRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <p className="font-medium text-sm">{record.documentName}</p>
                      </div>
                      {record.isCommitted ? (
                        <span className="flex items-center gap-1 text-xs text-success">
                          <CheckCircle className="w-3 h-3" />
                          Committed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-accent">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-xs text-muted-foreground mb-2">{record.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.uploadedAt).toLocaleDateString()}
                    </p>
                    {!record.isCommitted && canCommit && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() => handleCommit(record.id)}
                      >
                        Approve Record
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mb-3 opacity-50" />
                <p>No health records found</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mb-3 opacity-50" />
              <p>Select a patient to view records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

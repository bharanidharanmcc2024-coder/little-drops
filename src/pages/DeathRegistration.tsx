import { useState } from 'react';
import { usePatients } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileText, Search, AlertCircle } from 'lucide-react';

export default function DeathRegistration() {
  const { patients, registerDeath } = usePatients();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [deathDate, setDeathDate] = useState('');
  const [deathReason, setDeathReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const admittedPatients = patients.filter((p) => p.status === 'admitted');
  const filteredPatients = admittedPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patient = patients.find((p) => p.id === selectedPatient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIsSubmitting(true);

    try {
      registerDeath(selectedPatient, new Date(deathDate), deathReason);

      toast({
        title: 'Death Registered',
        description: `Death registration for ${patient?.name} has been recorded.`,
      });

      setSelectedPatient(null);
      setDeathDate('');
      setDeathReason('');
      setSearchQuery('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register death. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Death Registration</h1>
        </div>
        <p className="text-muted-foreground">
          Register the death of a patient at Seva Ashram
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Selection */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">Select Patient</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patient by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No admitted patients found</p>
                </div>
              ) : (
                filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatient(p.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedPatient === p.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Age: {p.age} • Memo: {p.memoNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Admitted: {new Date(p.admissionDate).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Death Details Form */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">Death Details</h2>
          
          {selectedPatient && patient ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg mb-4">
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-muted-foreground">
                  Age: {patient.age} years old
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deathDate">Date of Death *</Label>
                <Input
                  id="deathDate"
                  type="date"
                  value={deathDate}
                  onChange={(e) => setDeathDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deathReason">Reason for Death *</Label>
                <Textarea
                  id="deathReason"
                  value={deathReason}
                  onChange={(e) => setDeathReason(e.target.value)}
                  placeholder="Enter the cause of death..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedPatient(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register Death'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mb-3 opacity-50" />
              <p>Select a patient to register death</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

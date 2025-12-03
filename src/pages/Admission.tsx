import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Upload, Camera, Fingerprint } from 'lucide-react';

export default function Admission() {
  const { user } = useAuth();
  const { addPatient } = usePatients();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dateOfBirth: '',
    memoNumber: '',
    aadharNumber: '',
    guardianName: '',
    guardianSignature: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [fingerprintFile, setFingerprintFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      addPatient({
        name: formData.name,
        age: parseInt(formData.age),
        dateOfBirth: new Date(formData.dateOfBirth),
        memoNumber: formData.memoNumber,
        aadharNumber: formData.aadharNumber || undefined,
        guardianName: formData.guardianName,
        guardianSignature: formData.guardianSignature || undefined,
        photoUrl: photoFile ? URL.createObjectURL(photoFile) : undefined,
        fingerprintUrl: fingerprintFile ? URL.createObjectURL(fingerprintFile) : undefined,
        admissionDate: new Date(),
        status: 'admitted',
        isAdmissionCommitted: false,
        createdBy: user?.id || '',
      });

      toast({
        title: 'Admission Recorded',
        description: `${formData.name} has been successfully admitted.`,
      });

      // Reset form
      setFormData({
        name: '',
        age: '',
        dateOfBirth: '',
        memoNumber: '',
        aadharNumber: '',
        guardianName: '',
        guardianSignature: '',
      });
      setPhotoFile(null);
      setFingerprintFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record admission. Please try again.',
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
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">New Admission</h1>
        </div>
        <p className="text-muted-foreground">
          Register a new patient admission to Seva Ashram
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter patient's full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Enter age"
                min="60"
                max="120"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memo">Memo Number *</Label>
              <Input
                id="memo"
                value={formData.memoNumber}
                onChange={(e) => setFormData({ ...formData, memoNumber: e.target.value })}
                placeholder="Enter memo number"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="aadhar">Aadhar Number (Optional)</Label>
              <Input
                id="aadhar"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">Guardian Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianName">Guardian Name *</Label>
              <Input
                id="guardianName"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="Enter guardian's name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianSignature">Guardian Signature</Label>
              <Input
                id="guardianSignature"
                value={formData.guardianSignature}
                onChange={(e) => setFormData({ ...formData, guardianSignature: e.target.value })}
                placeholder="Digital signature or name"
              />
            </div>
          </div>
        </div>

        {/* Documents Upload */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Patient Photo</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                {photoFile ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(photoFile)}
                      alt="Patient preview"
                      className="w-24 h-24 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-sm text-muted-foreground">{photoFile.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPhotoFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Camera className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Fingerprint Upload */}
            <div className="space-y-2">
              <Label>Fingerprint</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                {fingerprintFile ? (
                  <div className="space-y-2">
                    <Fingerprint className="w-10 h-10 mx-auto text-success" />
                    <p className="text-sm text-muted-foreground">{fingerprintFile.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFingerprintFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Fingerprint className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload fingerprint</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFingerprintFile(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" variant="gradient" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Record Admission'}
          </Button>
        </div>
      </form>
    </div>
  );
}

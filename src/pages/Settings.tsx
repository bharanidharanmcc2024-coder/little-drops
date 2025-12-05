import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Building, Bell, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Settings() {
  const { user } = useAuth();

  // Only founders can access settings
  if (user?.role !== 'founder') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage system configuration and preferences
        </p>
      </div>

      {/* Organization Settings */}
      <div className="form-section">
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Organization</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input id="orgName" defaultValue="Little Drops" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgEmail">Contact Email</Label>
            <Input id="orgEmail" type="email" defaultValue="littledrops.org" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="orgAddress">Address</Label>
            <Input id="orgAddress" defaultValue="1 , kalluri salai , chennai, Tamil Nadu" />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="form-section">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email alerts for new admissions and deaths
              </p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Daily Reports</p>
              <p className="text-sm text-muted-foreground">
                Automated daily summary reports
              </p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="form-section">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted-foreground">
                Update your account password
              </p>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="gradient">Save Changes</Button>
      </div>
    </div>
  );
}

import { useAuth } from '@/contexts/AuthContext';
import { usePatients } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  FileText,
  AlertCircle,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, patients } = usePatients();
  const navigate = useNavigate();

  const pendingAdmissions = patients.filter((p) => !p.isAdmissionCommitted);
  const pendingDeaths = patients.filter(
    (p) => p.status === 'deceased' && !p.isDeathCommitted
  );

  const canCommit = user?.role === 'trustee' || user?.role === 'founder';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here's an overview of Seva Ashram.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card animate-slide-up stagger-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalAdmissions}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Admissions</p>
        </div>

        <div className="stat-card animate-slide-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
              +{stats.admissionsLast28Days}
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.admissionsLast28Days}</p>
          <p className="text-sm text-muted-foreground mt-1">Last 28 Days</p>
        </div>

        <div className="stat-card animate-slide-up stagger-3">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Records
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalDeaths}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Deaths</p>
        </div>

        <div className="stat-card animate-slide-up stagger-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
            {stats.pendingCommitments > 0 && (
              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                Action Needed
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.pendingCommitments}</p>
          <p className="text-sm text-muted-foreground mt-1">Pending Commits</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/admission')}
            >
              <UserPlus className="w-5 h-5" />
              <span>New Admission</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/death')}
            >
              <FileText className="w-5 h-5" />
              <span>Death Registration</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/health')}
            >
              <Calendar className="w-5 h-5" />
              <span>Health Records</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/search')}
            >
              <Users className="w-5 h-5" />
              <span>Search Patients</span>
            </Button>
          </div>
        </div>

        {/* Pending Commitments */}
        <div className="form-section">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Pending Commitments
          </h2>
          {pendingAdmissions.length === 0 && pendingDeaths.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mb-3 text-success" />
              <p>All records have been committed</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingAdmissions.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Admission • {new Date(patient.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  {canCommit && (
                    <Button size="sm" variant="outline">
                      Commit
                    </Button>
                  )}
                </div>
              ))}
              {pendingDeaths.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Death • {patient.deathDate && new Date(patient.deathDate).toLocaleDateString()}
                    </p>
                  </div>
                  {canCommit && (
                    <Button size="sm" variant="outline">
                      Commit
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Admissions */}
      <div className="form-section">
        <h2 className="text-lg font-semibold mb-4">Recent Admissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Age</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Memo No.</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Admission Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 5).map((patient) => (
                <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{patient.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{patient.age}</td>
                  <td className="py-3 px-4 text-muted-foreground">{patient.memoNumber}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(patient.admissionDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        patient.status === 'admitted'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {patient.status === 'admitted' ? 'Admitted' : 'Deceased'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Shield, Crown, User, Star } from 'lucide-react';
import { UserRole } from '@/types';
import { Navigate } from 'react-router-dom';

// Mock users list
const mockUsersList = [
  { id: '1', name: 'EJ PAUL', email: 'founder@oldhome.com', role: 'founder' as UserRole, isHigherAuthority: false },
  { id: '2', name: 'Mr BOVAS', email: 'trustee@oldhome.com', role: 'trustee' as UserRole, isHigherAuthority: false },
  { id: '3', name: 'jeba', email: 'staff@oldhome.com', role: 'staff' as UserRole, isHigherAuthority: true },
  { id: '4', name: 'esther', email: 'staff2@oldhome.com', role: 'staff' as UserRole, isHigherAuthority: false },
];

const roleIcons = {
  staff: User,
  trustee: Shield,
  founder: Crown,
};

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsersList);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' as UserRole,
    isHigherAuthority: false,
  });

  // Only founders can access this page
  if (user?.role !== 'founder') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUserData = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isHigherAuthority: newUser.isHigherAuthority,
    };

    setUsers([...users, newUserData]);
    
    toast({
      title: 'User Created',
      description: `${newUser.name} has been added as a ${newUser.role}.`,
    });

    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'staff',
      isHigherAuthority: false,
    });
    setShowCreateForm(false);
  };

  const toggleHigherAuthority = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId && u.role === 'staff'
        ? { ...u, isHigherAuthority: !u.isHigherAuthority }
        : u
    ));
    toast({
      title: 'Authority Updated',
      description: 'Staff member authority status has been updated.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage staff, trustees, and their permissions
          </p>
        </div>
        <Button variant="gradient" onClick={() => setShowCreateForm(!showCreateForm)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="form-section animate-slide-up">
          <h2 className="text-lg font-semibold mb-4">Create New User</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Create password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(v: UserRole) => setNewUser({ ...newUser, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="trustee">Trustee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {newUser.role === 'staff' && (
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                <Switch
                  id="higherAuthority"
                  checked={newUser.isHigherAuthority}
                  onCheckedChange={(checked) =>
                    setNewUser({ ...newUser, isHigherAuthority: checked })
                  }
                />
                <div>
                  <Label htmlFor="higherAuthority" className="font-medium">
                    Higher Authority
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Can approve health records
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Create User
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="form-section">
        <h2 className="text-lg font-semibold mb-4">All Users ({users.length})</h2>
        <div className="space-y-3">
          {users.map((u) => {
            const RoleIcon = roleIcons[u.role];
            return (
              <div
                key={u.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    u.role === 'founder' ? 'bg-accent/20 text-accent' :
                    u.role === 'trustee' ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{u.name}</p>
                      {u.isHigherAuthority && (
                        <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3" />
                          Higher Authority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${
                    u.role === 'founder' ? 'bg-accent/10 text-accent' :
                    u.role === 'trustee' ? 'bg-primary/10 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {u.role}
                  </span>
                  {u.role === 'staff' && u.id !== user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleHigherAuthority(u.id)}
                    >
                      {u.isHigherAuthority ? 'Remove Authority' : 'Make Higher Authority'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

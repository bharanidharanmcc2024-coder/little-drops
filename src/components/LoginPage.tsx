import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, Shield, Crown, Heart, Eye, EyeOff } from 'lucide-react';

const roles: { id: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'staff', label: 'Staff Login', icon: Users, description: 'For caregivers and support staff' },
  { id: 'trustee', label: 'Trustee Login', icon: Shield, description: 'For board members and trustees' },
  { id: 'founder', label: 'Founder Login', icon: Crown, description: 'Full administrative access' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        toast({
          title: 'Welcome!',
          description: 'You have successfully logged in.',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials or role mismatch.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm mb-4">
            <Heart className="w-8 h-8 text-sidebar-primary" />
          </div>
          <h1 className="text-3xl font-bold text-sidebar-foreground mb-2">
            Seva Ashram
          </h1>
          <p className="text-sidebar-foreground/70">
            Old Age Home Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8 bg-card">
          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                    selectedRole === role.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{role.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground text-center mb-6">
            {roles.find((r) => r.id === selectedRole)?.description}
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Demo Credentials</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium">Founder:</span> founder@oldhome.com / founder123</p>
              <p><span className="font-medium">Trustee:</span> trustee@oldhome.com / trustee123</p>
              <p><span className="font-medium">Staff:</span> staff@oldhome.com / staff123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

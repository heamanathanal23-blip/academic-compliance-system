import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign-up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState('student');
  const [signupDepartment, setSignupDepartment] = useState('Computer Science');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await login(loginEmail, loginPassword);
      navigate('/');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    setSignupLoading(true);

    // Validation
    if (!signupName.trim()) {
      setSignupError('Name is required');
      setSignupLoading(false);
      return;
    }
    if (!signupEmail.trim()) {
      setSignupError('Email is required');
      setSignupLoading(false);
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters');
      setSignupLoading(false);
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      setSignupLoading(false);
      return;
    }

    try {
      await register({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        department: signupDepartment
      });
      setSignupSuccess('✅ Registration successful! Logging you in...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setSignupError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-lg bg-primary/15 p-3">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Academic Compass</CardTitle>
          <CardDescription>Student Analytics & Support Platform</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-destructive/20 border border-destructive text-destructive rounded-md text-sm">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md text-xs text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground">📝 Demo Credentials:</div>
                  <div>🔑 <strong>Admin:</strong> admin@university.edu / password123</div>
                  <div>👨‍🏫 <strong>Faculty:</strong> faculty@university.edu / password123</div>
                  <div>👤 <strong>Student:</strong> student@university.edu / password123</div>
                </div>

                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                {signupError && (
                  <div className="p-3 bg-destructive/20 border border-destructive text-destructive rounded-md text-sm">
                    {signupError}
                  </div>
                )}

                {signupSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 dark:text-green-400 rounded-md text-sm">
                    {signupSuccess}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="john@university.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <select
                    value={signupDepartment}
                    onChange={(e) => setSignupDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                    <option value="Science">Science</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={signupLoading}>
                  {signupLoading ? 'Creating account...' : 'Create Account'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By signing up, you agree to our terms of service
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

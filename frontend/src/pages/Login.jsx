import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, User, Lock, Loader2, ShieldCheck, GraduationCap, School } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { getErrorMessage } from '../utils/getErrorMessage';

const showDemoHints = import.meta.env.DEV;

const Login = () => {
  const [role, setRole] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error('Please enter your school ID or email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier.trim(), password, role);
      toast.success('Signed in successfully.');
      navigate(`/${role}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Sign in failed. Check your ID, password, and account type.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md fade-in z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 mb-4 border border-accent-500/20 shadow-xl">
            <BookOpen className="w-8 h-8 text-accent-400" aria-hidden />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">EduConnect</h1>
          <p className="text-slate-400 text-sm">School portal — sign in with your campus ID or email</p>
        </div>

        <div className="bg-dark-800 rounded-3xl p-8 shadow-2xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-500 via-indigo-500 to-purple-500" />

          <div
            className="flex p-1.5 bg-dark-900 rounded-2xl mb-8 border border-slate-700/50 shadow-inner overflow-x-auto gap-1"
            role="tablist"
            aria-label="Account type"
          >
            {[
              { id: 'student', label: 'Student', icon: GraduationCap },
              { id: 'trainer', label: 'Faculty', icon: School },
              { id: 'admin', label: 'Admin', icon: ShieldCheck },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={role === id}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
                  role === id
                    ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20 scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                onClick={() => setRole(id)}
              >
                <Icon className="w-3.5 h-3.5 hidden sm:block shrink-0" aria-hidden />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="educonnect-identifier" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                {role === 'student'
                  ? 'Student ID or school email'
                  : role === 'trainer'
                    ? 'Faculty ID or school email'
                    : 'Administrator ID or email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" aria-hidden />
                </div>
                <input
                  id="educonnect-identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-dark-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all font-medium text-sm shadow-inner"
                  placeholder={
                    role === 'student' ? 'e.g. IDH-001 or student1@…' : role === 'trainer' ? 'e.g. TRN-001' : 'e.g. ADM-001'
                  }
                />
              </div>
            </div>

            <div>
              <label htmlFor="educonnect-password" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" aria-hidden />
                </div>
                <input
                  id="educonnect-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-dark-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all font-medium text-sm shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-accent-500 hover:bg-accent-400 disabled:opacity-60 disabled:pointer-events-none text-white font-black rounded-2xl shadow-xl shadow-accent-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-label="Signing in" /> : 'Sign in'}
            </button>
          </form>

          {showDemoHints && (
            <div className="mt-6 p-4 rounded-2xl border border-slate-700/60 bg-dark-900/80 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Local demo (after seed)</p>
              <ul className="text-[11px] text-slate-400 space-y-1.5 leading-relaxed font-mono">
                <li>
                  <span className="text-accent-400">Student</span> IDH-001 / student1@educonnect.com — student123
                </li>
                <li>
                  <span className="text-accent-400">Faculty</span> TRN-001 / trainer@educonnect.com — trainer123
                </li>
                <li>
                  <span className="text-accent-400">Admin</span> ADM-001 / admin@educonnect.com — admin123
                </li>
              </ul>
            </div>
          )}

          <div className="mt-6 p-4 bg-dark-900/60 rounded-2xl border border-slate-700/50 text-xs text-slate-400 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="font-bold text-slate-300 mb-0.5">School-managed accounts</p>
              <p className="leading-relaxed text-[11px]">
                Faculty and administrator accounts are issued by your school. Students may self-register only when your school enables it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

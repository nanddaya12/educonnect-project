import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, Calendar, 
  CreditCard, User as UserIcon, LogOut, Menu, X, Settings
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const DashboardLayout = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.name || user?.profile?.name || user?.uniqueId || 'User';

  const trainerLinks = [
    { name: 'Dashboard Overview', icon: LayoutDashboard, path: '/trainer' },
    { name: 'Students', icon: Users, path: '/trainer/students' },
    { name: 'Assignments', icon: BookOpen, path: '/trainer/assignments' },
    { name: 'Attendance', icon: Calendar, path: '/trainer/attendance' },
    { name: 'Fees', icon: CreditCard, path: '/trainer/fees' },
    { name: 'Profile', icon: Settings, path: '/trainer/profile' },
  ];

  const adminLinks = [
    { name: 'System Overview', icon: LayoutDashboard, path: '/admin' },
    { name: 'Faculty Management', icon: Users, path: '/admin/trainers' },
    { name: 'Students Directory', icon: Users, path: '/admin/students' },
    { name: 'Assignments Hub', icon: BookOpen, path: '/admin/assignments' },
    { name: 'Attendance Audit', icon: Calendar, path: '/admin/attendance' },
    { name: 'Billing & Invoices', icon: CreditCard, path: '/admin/fees' },
    { name: 'System Profile', icon: Settings, path: '/admin/profile' },
  ];

  const studentLinks = [
    { name: 'Dashboard Overview', icon: LayoutDashboard, path: '/student' },
    { name: 'Assignments', icon: BookOpen, path: '/student/assignments' },
    { name: 'Attendance', icon: Calendar, path: '/student/attendance' },
    { name: 'Fees', icon: CreditCard, path: '/student/fees' },
    { name: 'Profile', icon: UserIcon, path: '/student/profile' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'trainer' ? trainerLinks : studentLinks;

  const basePath = role === 'admin' ? '/admin' : role === 'trainer' ? '/trainer' : '/student';

  const isLinkActive = (path) => {
    if (path === basePath) {
      return location.pathname === path || location.pathname === `${path}/`;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen bg-dark-900 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-dark-800 border-r border-slate-700 transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-accent-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent-400" />
              </div>
              <span className="text-xl font-bold text-white">EduConnect</span>
            </div>
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {links.map((link) => {
              const isActive = isLinkActive(link.path);
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-dark-700/50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-dark-900">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                {displayName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-dark-800 border-b border-slate-700 lg:hidden">
          <button 
            className="text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-white">EduConnect</span>
          <div className="w-6 h-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

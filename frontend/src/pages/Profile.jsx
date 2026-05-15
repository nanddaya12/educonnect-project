import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Key, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

const Profile = () => {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.profile?.name || 'Academic Member',
    email: user?.email || 'user@educonnect.com',
    role: user?.role || 'student',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      name: user?.name || user?.profile?.name || prev.name,
      email: user?.email || prev.email,
      role: user?.role || prev.role,
    }));
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile settings updated successfully!');
    setProfileData({ ...profileData, currentPassword: '', newPassword: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-slate-400 mt-1">Manage your personal account information and security preferences.</p>
      </div>

      <div className="bg-dark-800 border border-slate-700/50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-accent-500/20 to-indigo-500/20 border-b border-slate-700/50"></div>

        <div className="relative pt-16 flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-slate-700/50 pb-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-dark-900 border-4 border-slate-700/80 flex items-center justify-center text-4xl font-bold text-accent-400 overflow-hidden shadow-2xl">
              {profileData.name.charAt(0)}
            </div>
            <button className="absolute bottom-1 right-1 bg-accent-500 hover:bg-accent-400 text-white p-2 rounded-full transition-colors shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">{profileData.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-xs bg-dark-900 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {profileData.email}
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-accent-500/10 border border-accent-500/20 px-3 py-1 rounded-full text-accent-400 uppercase font-semibold tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                {profileData.role}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Display Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-accent-400" />
              Security / Change Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Current Password</label>
                <input
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-accent-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-2">New Password</label>
                <input
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-accent-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-accent-500/20"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

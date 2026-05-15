import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, ShieldCheck, Filter, X, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { getErrorMessage } from '../../utils/getErrorMessage';

const FacultyManagement = () => {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ name: '', email: '', department: 'Academic Faculty', phone: '', password: '' });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await api.get('/api/trainers');
      setTrainers(res.data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load faculty records.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/trainers', newTrainer);
      setTrainers([res.data, ...trainers]);
      toast.success('Faculty member registered successfully!');
      setIsModalOpen(false);
      setNewTrainer({ name: '', email: '', department: 'Academic Faculty', phone: '', password: '' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not register faculty member.'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this faculty member?')) {
      try {
        await api.delete(`/api/trainers/${id}`);
        setTrainers(trainers.filter(t => t._id !== id));
        toast.success('Faculty record removed.');
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not remove faculty record.'));
      }
    }
  };

  const filteredTrainers = trainers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.user?.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Faculty Management</h1>
          <p className="text-slate-400 mt-1 text-sm">Administrate academic staff and department allocations.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-accent-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Register Faculty
        </button>
      </div>

      <div className="bg-dark-800 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-dark-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-500"
              placeholder="Search faculty by name, ID, or email..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-dark-900/60 text-slate-400 text-xs uppercase font-bold border-b border-slate-700/50">
                <th className="px-6 py-4">Faculty Member</th>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading records...</td></tr>
              ) : filteredTrainers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">No faculty found.</td></tr>
              ) : (
                filteredTrainers.map((trainer) => (
                  <tr key={trainer._id} className="hover:bg-dark-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 font-bold">
                          {trainer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold">{trainer.name}</p>
                          <p className="text-slate-400 text-xs">{trainer.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-300 bg-dark-900 px-2 py-1 rounded border border-slate-700">
                        {trainer.user?.uniqueId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{trainer.department}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{trainer.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(trainer._id)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full space-y-6">
            <h2 className="text-xl font-bold text-white">Register New Faculty</h2>
            <form onSubmit={handleCreateTrainer} className="space-y-4">
              <input
                type="text" placeholder="Full Name" required
                value={newTrainer.name} onChange={e => setNewTrainer({...newTrainer, name: e.target.value})}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:border-accent-500"
              />
              <input
                type="email" placeholder="Email Address" required
                value={newTrainer.email} onChange={e => setNewTrainer({...newTrainer, email: e.target.value})}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:border-accent-500"
              />
              <input
                type="text" placeholder="Department" required
                value={newTrainer.department} onChange={e => setNewTrainer({...newTrainer, department: e.target.value})}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:border-accent-500"
              />
              <input
                type="password" placeholder="Initial Password" required
                value={newTrainer.password} onChange={e => setNewTrainer({...newTrainer, password: e.target.value})}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:border-accent-500"
              />
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-accent-500 text-white rounded-xl font-bold">Register Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;

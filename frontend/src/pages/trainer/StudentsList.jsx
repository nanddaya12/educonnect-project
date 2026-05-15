import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, Users, GraduationCap, CheckCircle2, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { getErrorMessage } from '../../utils/getErrorMessage';
import useAuthStore from '../../store/useAuthStore';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', course: 'React Mastery', batch: 'Batch A', phone: '', password: '' });
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoadError(null);
    setIsLoading(true);
    try {
      const res = await api.get('/api/students');
      setStudents(res.data);
    } catch (error) {
      setStudents([]);
      setLoadError(getErrorMessage(error, 'Could not load students.'));
      toast.error(getErrorMessage(error, 'Could not load students.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/students', newStudent);
      setStudents([res.data, ...students]);
      toast.success('Student registered successfully!');
      setIsModalOpen(false);
      setNewStudent({ name: '', email: '', course: 'React Mastery', batch: 'Batch A', phone: '', password: '' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not register student.'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this student record?')) {
      try {
        await api.delete(`/api/students/${id}`);
        setStudents(students.filter(s => s._id !== id));
        toast.success('Student record archived.');
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not remove student record.'));
      }
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.user?.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All' || s.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-400 mt-1 text-sm">Comprehensive listing of all active enrolled students across academic cohorts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-accent-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Enroll New Student
        </button>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => fetchStudents()}
            className="shrink-0 text-amber-200 font-bold hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Roster Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-dark-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-3xl font-black text-white mt-1">{students.length} Students</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">React Track</p>
            <h3 className="text-3xl font-black text-accent-400 mt-1">
              {students.filter(s => s.course.includes('React')).length} Active
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">System Standing</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-1">100% Verifiable</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-dark-800 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
        {/* Search & Filters */}
        <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row gap-4 justify-between items-center bg-dark-800/50">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-dark-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 transition-all font-medium text-sm"
              placeholder="Search by student name, ID, or email..."
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" /> Filter Track:
            </span>
            {['All', 'React Mastery', 'Node.js Backend', 'Full Stack Web'].map((course) => (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCourse === course 
                    ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20' 
                    : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-900/60 text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-slate-700/50">
                <th className="px-6 py-4">Student Profile</th>
                <th className="px-6 py-4">Assigned ID</th>
                <th className="px-6 py-4">Academic Track & Cohort</th>
                <th className="px-6 py-4">Contact Phone</th>
                <th className="px-6 py-4 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">Loading student records...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">No students match your filter criteria.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-dark-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent-500/20 to-indigo-500/20 border border-accent-500/30 text-accent-400 flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-105 transition-transform">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-base group-hover:text-accent-400 transition-colors">{student.name}</p>
                          <p className="text-slate-400 text-xs">{student.user?.email || 'email@educonnect.com'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-lg bg-dark-900 border border-slate-700 text-slate-300 font-mono font-bold text-xs shadow-sm">
                        {student.user?.uniqueId || 'IDH-000'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          student.course.includes('React') ? 'bg-blue-400' : student.course.includes('Node') ? 'bg-emerald-400' : 'bg-purple-400'
                        }`} />
                        <div>
                          <p className="text-white font-bold">{student.course}</p>
                          <p className="text-slate-400 text-xs font-medium">{student.batch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => toast.success(`Editing profile for ${student.name}`)}
                          className="p-2 text-slate-400 hover:text-accent-400 hover:bg-accent-400/10 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(student._id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-slate-700/80 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-dark-900 p-2 rounded-full border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-2xl font-black text-white">Enroll New Student</h2>
              <p className="text-slate-400 text-xs mt-1">Register a new academic profile into the student management database.</p>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium"
                  placeholder="e.g., Emily Watson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium"
                  placeholder="emily@educonnect.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Academic Track</label>
                  <select
                    value={newStudent.course}
                    onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium"
                  >
                    <option value="React Mastery">React Mastery</option>
                    <option value="Node.js Backend">Node.js Backend</option>
                    <option value="Full Stack Web">Full Stack Web</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Batch</label>
                  <select
                    value={newStudent.batch}
                    onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium"
                  >
                    <option value="Batch A">Batch A (Morning)</option>
                    <option value="Batch B">Batch B (Afternoon)</option>
                    <option value="Batch C">Batch C (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Contact</label>
                <input
                  type="text"
                  required
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium"
                  placeholder="Set initial password"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-400 hover:bg-dark-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent-500 hover:bg-accent-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent-500/20 active:scale-95"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;

import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, BookOpen, FileText, CheckCircle, Clock, UploadCloud, Paperclip, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import useAuthStore from '../store/useAuthStore';
import { getErrorMessage } from '../utils/getErrorMessage';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: 'Frontend', description: '', dueDate: '', attachmentName: '' });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/api/assignments');
      setAssignments(res.data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load assignments.'));
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/assignments', {
        title: newAssignment.title,
        subject: newAssignment.subject,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate || new Date().toISOString(),
      });
      setAssignments([res.data, ...assignments]);
      toast.success('Assignment published successfully.');
      setIsCreateModalOpen(false);
      setNewAssignment({ title: '', subject: 'Frontend', description: '', dueDate: '', attachmentName: '' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not publish assignment.'));
    }
  };

  const handleSubmitWork = (e) => {
    e.preventDefault();
    if (!submissionFile) {
      toast.error('Please attach a submission file');
      return;
    }
    setAssignments(assignments.map(a => a._id === selectedAssignment._id ? { ...a, status: 'Submitted', submissionFile: submissionFile.name } : a));
    toast.success('File uploaded and assignment submitted successfully!');
    setIsSubmitModalOpen(false);
    setSubmissionFile(null);
    setSubmissionNote('');
  };

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Assignment Workspace</h1>
          <p className="text-slate-400 mt-1 text-sm">Explore curriculum assignments, download guidelines, and upload deliverables.</p>
        </div>
        {(user?.role === 'trainer' || user?.role === 'admin') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-accent-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Publish Assignment
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-dark-800 p-4 rounded-2xl border border-slate-700/50 shadow-xl flex gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-dark-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 transition-all text-sm font-medium"
            placeholder="Search assignments by title or subject..."
          />
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-slate-400 col-span-full text-center py-12 font-medium">Loading assignments...</p>
        ) : filteredAssignments.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center py-12 font-medium">No assignments found matching your search criteria.</p>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment._id} className="bg-dark-800 rounded-2xl border border-slate-700/50 p-6 shadow-xl flex flex-col justify-between hover:border-slate-600 transition-all group">
              <div>
                <div className="flex justify-between items-start gap-3 mb-4">
                  <span className="px-3 py-1 bg-accent-500/10 text-accent-400 border border-accent-500/20 rounded-lg text-xs font-bold uppercase tracking-wider shadow-inner">
                    {assignment.subject}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg shadow-sm ${
                    assignment.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    assignment.status === 'Graded' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {assignment.status === 'Submitted' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {assignment.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">{assignment.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-3">{assignment.description}</p>

                {/* Attached Files display */}
                {assignment.attachedFile && (
                  <div className="flex items-center gap-2 p-2 bg-dark-900 rounded-xl border border-slate-700/50 text-xs text-slate-300 mb-4">
                    <Paperclip className="w-4 h-4 text-accent-400 flex-shrink-0" />
                    <span className="truncate font-mono">{assignment.attachedFile}</span>
                  </div>
                )}
                {assignment.submissionFile && (
                  <div className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-400 mb-4 font-medium">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate font-mono">Submitted: {assignment.submissionFile}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400 mt-4">
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                {user?.role === 'student' && assignment.status === 'Pending' && (
                  <button 
                    onClick={() => { setSelectedAssignment(assignment); setIsSubmitModalOpen(true); }}
                    className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-400 text-white font-bold px-3.5 py-2 rounded-xl transition-all shadow-lg shadow-accent-500/20 active:scale-95 uppercase tracking-wider text-[11px]"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Submit File
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Assignment File Upload Modal */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-slate-700/80 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => { setIsSubmitModalOpen(false); setSubmissionFile(null); }}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-dark-900 p-2 rounded-full border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-2xl font-black text-white">Submit Deliverables</h2>
              <p className="text-slate-400 text-xs mt-1">Upload your academic assignment files for <span className="text-accent-400 font-bold">{selectedAssignment.title}</span>.</p>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-5">
              {/* Dropzone File Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Upload File (PDF, ZIP, Code)</label>
                <div className="border-2 border-dashed border-slate-600 hover:border-accent-500 bg-dark-900/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group relative">
                  <input
                    type="file"
                    required
                    onChange={(e) => setSubmissionFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-white font-bold text-sm mb-1">
                    {submissionFile ? submissionFile.name : 'Click to browse or drag file here'}
                  </p>
                  <p className="text-slate-500 text-xs font-mono">
                    {submissionFile ? `${(submissionFile.size / 1024).toFixed(1)} KB` : 'Maximum upload size: 25 MB'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Submission Notes (Optional)</label>
                <textarea
                  rows="3"
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 text-sm"
                  placeholder="Add any specific comments or repository URLs for your faculty evaluator..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => { setIsSubmitModalOpen(false); setSubmissionFile(null); }}
                  className="px-5 py-2.5 text-slate-400 hover:bg-dark-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent-500 hover:bg-accent-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent-500/20 active:scale-95 flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  Complete Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Assignment Modal (Trainer) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-slate-700/80 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-dark-900 p-2 rounded-full border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-2xl font-black text-white">Publish New Assignment</h2>
              <p className="text-slate-400 text-xs mt-1">Deploy academic coursework guidelines to enrolled cohorts.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium text-sm"
                  placeholder="e.g., Build a React Dashboard"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject Category</label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium text-sm"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="UI/UX">UI/UX Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Attach Resource Document</label>
                <div className="border border-slate-700 bg-dark-900 rounded-xl p-2.5 flex items-center gap-3">
                  <input
                    type="file"
                    onChange={(e) => setNewAssignment({ ...newAssignment, attachmentName: e.target.files[0]?.name || 'guidelines.pdf' })}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-accent-500 file:text-white hover:file:bg-accent-400 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description & Guidelines</label>
                <textarea
                  required
                  rows="3"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 font-medium text-sm"
                  placeholder="Provide detailed instructions and grading criteria..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 text-slate-400 hover:bg-dark-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent-500 hover:bg-accent-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent-500/20 active:scale-95"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;

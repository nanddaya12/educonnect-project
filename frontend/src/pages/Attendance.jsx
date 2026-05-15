import React, { useState, useEffect } from 'react';
import { Calendar, UserCheck, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import useAuthStore from '../store/useAuthStore';
import { getErrorMessage } from '../utils/getErrorMessage';

const toYmd = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
};

const Attendance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentsList, setStudentsList] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { data: records } = await api.get('/api/attendance');
        if (cancelled) return;

        const dayRow = records.find((a) => toYmd(a.date) === selectedDate);

        if (dayRow?.records?.length) {
          setStudentsList(
            dayRow.records.map((r) => ({
              _id: r.student?._id || r.student,
              name: r.student?.name || 'Student',
              status: r.status || 'Present',
            }))
          );
          return;
        }

        if (user?.role === 'trainer') {
          const { data: students } = await api.get('/api/students');
          if (cancelled) return;
          setStudentsList(
            students.map((s) => ({
              _id: s._id,
              name: s.name,
              status: 'Present',
            }))
          );
          return;
        }

        if (user?.role === 'student') {
          const sid = user.profile?._id;
          const name = user.profile?.name || user.email || 'Student';
          if (cancelled) return;
          setStudentsList(
            sid ? [{ _id: sid, name, status: 'Present' }] : [{ _id: 'unknown', name, status: 'Present' }]
          );
          return;
        }

        setStudentsList([]);
      } catch (error) {
        if (!cancelled) {
          toast.error(getErrorMessage(error, 'Could not load attendance.'));
          setStudentsList([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, user]);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...studentsList];
    updated[index].status = newStatus;
    setStudentsList(updated);
  };

  const saveAttendance = async () => {
    if (!studentsList.length) {
      toast.error('No students to save for this date.');
      return;
    }
    try {
      await api.post('/api/attendance', {
        date: selectedDate,
        records: studentsList.map((s) => ({ student: s._id, status: s.status })),
      });
      toast.success('Attendance saved successfully.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not save attendance.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance Roster</h1>
          <p className="text-slate-400 mt-1">Track and manage daily student attendance logs.</p>
        </div>
        <div className="flex items-center gap-3 bg-dark-800 border border-slate-700/50 px-4 py-2 rounded-lg">
          <Calendar className="w-5 h-5 text-accent-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer font-medium"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Present</p>
            <h3 className="text-3xl font-bold text-white mt-2">{studentsList.filter(s => s.status === 'Present').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Late</p>
            <h3 className="text-3xl font-bold text-white mt-2">{studentsList.filter(s => s.status === 'Late').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">Absent</p>
            <h3 className="text-3xl font-bold text-white mt-2">{studentsList.filter(s => s.status === 'Absent').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-dark-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className="font-bold text-white text-lg">Daily Register</h3>
          {user?.role === 'trainer' && (
            <button
              onClick={saveAttendance}
              className="bg-accent-500 hover:bg-accent-400 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-accent-500/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Attendance
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-900/50 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium border-b border-slate-700/50">Student Name</th>
                <th className="px-6 py-4 font-medium border-b border-slate-700/50">Status</th>
                <th className="px-6 py-4 font-medium border-b border-slate-700/50 text-right">Action / Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400 text-sm">
                    Loading roster…
                  </td>
                </tr>
              ) : studentsList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No attendance data for this date. Faculty: add students first, then mark and save.
                  </td>
                </tr>
              ) : (
                studentsList.map((student, index) => (
                  <tr key={`${student._id}-${index}`} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center font-semibold">
                          {(student.name || '?').charAt(0)}
                        </div>
                        <span className="text-white font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        student.status === 'Late' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user?.role === 'trainer' ? (
                        <div className="inline-flex rounded-lg bg-dark-900 p-1 border border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(index, 'Present')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${student.status === 'Present' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(index, 'Late')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${student.status === 'Late' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(index, 'Absent')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${student.status === 'Absent' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
                          >
                            Absent
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs font-mono">Logged</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

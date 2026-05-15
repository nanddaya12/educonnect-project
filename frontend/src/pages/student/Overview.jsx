import React from 'react';
import { BookOpen, Calendar, CreditCard, Award, Clock, ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Overview = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Premium Glassmorphic Welcome Banner */}
      <div className="bg-gradient-to-r from-accent-500/20 via-indigo-500/10 to-dark-800 rounded-2xl p-8 border border-accent-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl">
          <span className="px-3 py-1 bg-accent-500/10 text-accent-400 border border-accent-500/20 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 inline-block">
            Student Academic Workspace
          </span>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            You are enrolled in the <span className="text-accent-400 font-bold">MERN Stack Development Curriculum</span>. Track your upcoming lectures, assignment deadlines, and fee schedules below.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800 p-6 rounded-2xl border border-slate-700/50 shadow-xl group hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
              Optimal <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Attendance Rate</p>
          <p className="text-3xl font-black text-white mt-1">94.2%</p>
          <div className="w-full bg-dark-900 rounded-full h-1.5 mt-4">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-2xl border border-slate-700/50 shadow-xl group hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <span className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full text-blue-400 bg-blue-400/10 border border-blue-400/20">
              2 Due Soon <Clock className="w-3 h-3 ml-1" />
            </span>
          </div>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active Assignments</p>
          <p className="text-3xl font-black text-white mt-1">2 Pending</p>
          <p className="text-xs text-blue-400 font-medium mt-4 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Next deadline in 48 hours
          </p>
        </div>

        <div className="bg-dark-800 p-6 rounded-2xl border border-slate-700/50 shadow-xl group hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
              <CreditCard className="w-6 h-6 text-rose-400" />
            </div>
            <span className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full text-rose-400 bg-rose-400/10 border border-rose-400/20">
              Next Month
            </span>
          </div>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Billing Status</p>
          <p className="text-3xl font-black text-white mt-1">Paid</p>
          <p className="text-xs text-slate-400 font-medium mt-4 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Receipt Issued for May
          </p>
        </div>

        <div className="bg-dark-800 p-6 rounded-2xl border border-slate-700/50 shadow-xl group hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <span className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full text-purple-400 bg-purple-400/10 border border-purple-400/20">
              Top 15% <TrendingUp className="w-3 h-3 ml-1" />
            </span>
          </div>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overall Grade</p>
          <p className="text-3xl font-black text-white mt-1">A-</p>
          <p className="text-xs text-emerald-400 font-medium mt-4">Excellent Standing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule */}
        <div className="bg-dark-800 rounded-2xl border border-slate-700/50 p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-400" />
              Daily Class Schedule
            </h3>
            <div className="space-y-4">
              {[
                { time: '10:00 AM', subject: 'Advanced React Architecture', trainer: 'John Doe (Lead Trainer)', room: 'Virtual Lab A' },
                { time: '01:00 PM', subject: 'Express REST APIs & Middleware', trainer: 'Sarah Smith', room: 'Lecture Hall B' },
                { time: '03:30 PM', subject: 'MongoDB Aggregation Pipelines', trainer: 'Mike Johnson', room: 'Database Hub' },
              ].map((cls, i) => (
                <div key={i} className="flex items-center p-4 rounded-xl bg-dark-900 border border-slate-700/30 hover:bg-dark-700/30 transition-colors group">
                  <div className="w-24 text-accent-400 font-extrabold text-sm">{cls.time}</div>
                  <div className="flex-1 ml-4 border-l border-slate-700 pl-5">
                    <div className="flex justify-between items-center">
                      <p className="text-white font-bold group-hover:text-accent-400 transition-colors">{cls.subject}</p>
                      <span className="text-[10px] font-mono bg-dark-800 text-slate-400 px-2 py-1 rounded border border-slate-700">{cls.room}</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">Faculty: {cls.trainer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-8 py-2.5 bg-dark-900 hover:bg-dark-700 text-slate-300 font-medium rounded-xl border border-slate-700/50 text-xs uppercase tracking-wider transition-all">
            Open Full Academic Calendar
          </button>
        </div>

        {/* Recent Updates Feed */}
        <div className="bg-dark-800 rounded-2xl border border-slate-700/50 p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-400" />
              Recent Academic Activity
            </h3>
            <div className="space-y-6">
              {[
                { title: "Assignment Graded: React Basics", details: "Score: 95/100 • Graded by John Doe", time: "2 hours ago", color: "border-blue-500 bg-blue-500/10 text-blue-400" },
                { title: "Curriculum Notes Uploaded", details: "Node.js Architecture Slides & Lab Manuals", time: "5 hours ago", color: "border-purple-500 bg-purple-500/10 text-purple-400" },
                { title: "Attendance Registered", details: "Marked Present for Morning Bootcamp", time: "1 day ago", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
                { title: "Fee Receipt Generated", details: "Payment acknowledged for May Term ($500)", time: "3 days ago", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative items-start group p-3 rounded-xl hover:bg-dark-700/30 transition-colors">
                  {i !== 3 && <div className="absolute top-8 bottom-[-24px] left-5 w-0.5 bg-slate-700/60" />}
                  <div className={`w-3 h-3 rounded-full border-2 mt-1.5 flex-shrink-0 z-10 ${activity.color.split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm text-slate-200 font-bold truncate group-hover:text-white transition-colors">{activity.title}</h4>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-8 py-2.5 bg-dark-900 hover:bg-dark-700 text-slate-300 font-medium rounded-xl border border-slate-700/50 text-xs uppercase tracking-wider transition-all">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;

import React from 'react';
import { Users, GraduationCap, Clock, DollarSign, ArrowUpRight, BarChart3, Award, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="bg-dark-800 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/20">
    <div className={`absolute top-0 left-0 w-full h-1.5 ${colorClass}`} />
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-dark-900 border border-slate-700/50 shadow-inner">
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
          trend.startsWith('+') ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border border-rose-400/20'
        }`}>
          {trend} <ArrowUpRight className="w-3 h-3 ml-1" />
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</p>
    </div>
  </div>
);

const Overview = () => {
  const chartData = [
    { day: 'Mon', percentage: 95, color: 'from-blue-500 to-indigo-500' },
    { day: 'Tue', percentage: 88, color: 'from-emerald-500 to-teal-500' },
    { day: 'Wed', percentage: 92, color: 'from-blue-500 to-indigo-500' },
    { day: 'Thu', percentage: 96, color: 'from-purple-500 to-pink-500' },
    { day: 'Fri', percentage: 91, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-accent-500/20 via-indigo-500/10 to-dark-800 rounded-2xl p-8 border border-accent-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl">
          <span className="px-3 py-1 bg-accent-500/10 text-accent-400 border border-accent-500/20 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 inline-block">
            Academic Faculty Workspace
          </span>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Faculty Management Dashboard</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Monitor real-time academic performance metrics, attendance logs, and fee collection milestones across all active student batches.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Enrolments" value="156" icon={Users} trend="+12.4%" colorClass="bg-blue-500" />
        <StatCard title="Batch Attendance" value="92.4%" icon={Clock} trend="+3.1%" colorClass="bg-emerald-500" />
        <StatCard title="Submissions" value="28" icon={GraduationCap} trend="+8.0%" colorClass="bg-purple-500" />
        <StatCard title="Pending Invoices" value="$4,200" icon={DollarSign} trend="-5.2%" colorClass="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beautiful Custom CSS Chart */}
        <div className="lg:col-span-2 bg-dark-800 rounded-2xl border border-slate-700/50 p-8 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-400" />
                Weekly Attendance Analytics
              </h3>
              <p className="text-slate-400 text-xs mt-1">Average daily attendance percentage across all cohorts.</p>
            </div>
            <span className="text-xs bg-dark-900 border border-slate-700 px-3 py-1.5 rounded-lg text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Baseline (90%)
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex items-end justify-around h-64 pt-6 pb-2 border-b border-slate-700/50 px-4 bg-dark-900/40 rounded-xl border border-slate-700/30 shadow-inner">
            {chartData.map((data) => (
              <div key={data.day} className="flex flex-col items-center gap-3 w-16 group">
                <div className="relative w-full flex justify-center items-end h-48 bg-dark-800/60 rounded-lg p-1 border border-slate-700/40 transition-all duration-300 group-hover:border-slate-600">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark-900 border border-slate-700 text-white text-xs px-2.5 py-1 rounded shadow-xl font-bold z-10 pointer-events-none whitespace-nowrap">
                    {data.percentage}% Attended
                  </div>
                  {/* Fill Bar */}
                  <div 
                    className={`w-full bg-gradient-to-t ${data.color} rounded-md transition-all duration-700 shadow-md group-hover:brightness-110`}
                    style={{ height: `${data.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">{data.day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 text-center">
            <div className="p-4 bg-dark-900/50 rounded-xl border border-slate-700/30">
              <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Peak Day</span>
              <p className="text-white font-extrabold text-lg mt-1 text-purple-400">Thursday (96%)</p>
            </div>
            <div className="p-4 bg-dark-900/50 rounded-xl border border-slate-700/30">
              <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Weekly Target</span>
              <p className="text-white font-extrabold text-lg mt-1 text-emerald-400">Achieved</p>
            </div>
            <div className="p-4 bg-dark-900/50 rounded-xl border border-slate-700/30 col-span-2 sm:col-span-1">
              <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Weekly Variance</span>
              <p className="text-white font-extrabold text-lg mt-1 text-blue-400">+3.4%</p>
            </div>
          </div>
        </div>

        {/* Professional Activity Feed */}
        <div className="bg-dark-800 rounded-2xl border border-slate-700/50 p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-400" />
              Administrative Audit Log
            </h3>
            <div className="space-y-6">
              {[
                { text: "John Doe submitted React Assignment", time: "10 mins ago", category: "Academic", color: "border-blue-500 bg-blue-500/10 text-blue-400" },
                { text: "Sarah Smith marked present", time: "1 hour ago", category: "Attendance", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
                { text: "Fee payment receipt issued: $500", time: "2 hours ago", category: "Billing", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
                { text: "New student curriculum enrolment", time: "5 hours ago", category: "Enrolment", color: "border-purple-500 bg-purple-500/10 text-purple-400" },
                { text: "Mike Johnson missed 3 consecutive labs", time: "1 day ago", category: "Alert", color: "border-rose-500 bg-rose-500/10 text-rose-400" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative items-start group p-2.5 rounded-xl hover:bg-dark-700/30 transition-colors">
                  {i !== 4 && <div className="absolute top-8 bottom-[-24px] left-5 w-0.5 bg-slate-700/60" />}
                  <div className={`w-3 h-3 rounded-full border-2 mt-1.5 flex-shrink-0 z-10 ${activity.color.split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${activity.color.split(' ').slice(1).join(' ')}`}>
                        {activity.category}
                      </span>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                    <p className="text-sm text-slate-200 font-medium mt-1 truncate group-hover:text-white transition-colors">{activity.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-8 py-2.5 bg-dark-900 hover:bg-dark-700 text-slate-300 font-medium rounded-xl border border-slate-700/50 text-xs uppercase tracking-wider transition-all">
            View Complete System Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;

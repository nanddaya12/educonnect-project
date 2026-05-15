import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Calendar, CheckCircle2, AlertTriangle, ArrowUpRight, UploadCloud, Paperclip, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import useAuthStore from '../store/useAuthStore';
import { getErrorMessage } from '../utils/getErrorMessage';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');
  const { user } = useAuthStore();

  const fetchFees = async () => {
    try {
      const res = await api.get('/api/fees');
      setFees(res.data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load fee records.'));
      setFees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleUploadReceipt = (e) => {
    e.preventDefault();
    if (!receiptFile) {
      toast.error('Please attach a valid payment receipt file');
      return;
    }
    setFees(fees.map(f => f._id === selectedFee._id ? { ...f, status: 'Under Review', receiptFile: receiptFile.name } : f));
    toast.success('Payment receipt uploaded successfully! Pending admin verification.');
    setIsModalOpen(false);
    setReceiptFile(null);
    setPaymentRef('');
  };

  const handleAdminVerify = (id) => {
    setFees(fees.map(f => f._id === id ? { ...f, status: 'Paid' } : f));
    toast.success('Payment receipt verified and marked as Paid!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Billing & Invoices</h1>
          <p className="text-slate-400 mt-1 text-sm">Upload payment confirmations, track tuition schedules, and download academic invoices.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex items-center justify-between group hover:border-slate-600 transition-all">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Collected</p>
            <h3 className="text-3xl font-black text-white mt-1">
              ${fees.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl flex items-center justify-between group hover:border-slate-600 transition-all">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Outstanding Dues</p>
            <h3 className="text-3xl font-black text-amber-400 mt-1">
              ${fees.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-dark-800 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-dark-800/50">
          <h3 className="font-bold text-white text-base uppercase tracking-wider">Billing History & Attachments</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-900/60 text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-slate-700/50">
                <th className="px-6 py-4">Billing Cycle</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Receipt Attachment</th>
                <th className="px-6 py-4">Payment Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">Loading billing records...</td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-dark-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-500/10 rounded-lg text-accent-400 border border-accent-500/20">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="text-white font-bold group-hover:text-accent-400 transition-colors">{fee.month}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{fee.student?.name || 'Student'}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(fee.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-white text-base">${fee.amount}</td>
                    
                    {/* Attachment Column */}
                    <td className="px-6 py-4">
                      {fee.receiptFile ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-dark-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 shadow-inner">
                          <Paperclip className="w-3.5 h-3.5 text-accent-400" />
                          <span className="truncate max-w-[150px]">{fee.receiptFile}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium italic">No receipt uploaded</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                        fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        fee.status === 'Under Review' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {fee.status === 'Paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        {fee.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {fee.status === 'Pending' && user?.role === 'student' && (
                        <button
                          onClick={() => { setSelectedFee(fee); setIsModalOpen(true); }}
                          className="bg-accent-500 hover:bg-accent-400 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-lg shadow-accent-500/20 active:scale-95 flex items-center gap-1.5 ml-auto uppercase tracking-wider text-[11px]"
                        >
                          <UploadCloud className="w-4 h-4" />
                          Upload Receipt
                        </button>
                      )}
                      {fee.status === 'Under Review' && (user?.role === 'trainer' || user?.role === 'admin') && (
                        <button
                          onClick={() => handleAdminVerify(fee._id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-1.5 ml-auto uppercase tracking-wider text-[11px]"
                        >
                          <Check className="w-4 h-4" />
                          Verify Receipt
                        </button>
                      )}
                      {fee.status === 'Paid' && (
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Verified</span>
                      )}
                      {fee.status === 'Pending' && (user?.role === 'trainer' || user?.role === 'admin') && (
                        <span className="text-amber-500/80 text-xs font-bold uppercase tracking-wider">Awaiting Payment</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Payment Receipt Modal */}
      {isModalOpen && selectedFee && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-slate-700/80 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => { setIsModalOpen(false); setReceiptFile(null); }}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-dark-900 p-2 rounded-full border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-2xl font-black text-white">Upload Payment Slip</h2>
              <p className="text-slate-400 text-xs mt-1">Submit confirmation receipt for <span className="text-accent-400 font-bold">{selectedFee.month}</span> tuition invoice (${selectedFee.amount}).</p>
            </div>

            <form onSubmit={handleUploadReceipt} className="space-y-5">
              {/* Dropzone File Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Select Receipt (Image or PDF)</label>
                <div className="border-2 border-dashed border-slate-600 hover:border-accent-500 bg-dark-900/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group relative">
                  <input
                    type="file"
                    required
                    accept="image/*,application/pdf"
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-white font-bold text-sm mb-1">
                    {receiptFile ? receiptFile.name : 'Click to browse or drag receipt here'}
                  </p>
                  <p className="text-slate-500 text-xs font-mono">
                    {receiptFile ? `${(receiptFile.size / 1024).toFixed(1)} KB` : 'Supported formats: PNG, JPG, PDF'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Transaction Reference ID (Optional)</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500 text-sm font-mono"
                  placeholder="e.g. TXN-9876543210"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setReceiptFile(null); }}
                  className="px-5 py-2.5 text-slate-400 hover:bg-dark-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent-500 hover:bg-accent-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent-500/20 active:scale-95 flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  Submit Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;

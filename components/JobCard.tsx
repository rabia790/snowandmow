import React, { useState } from 'react';
import { supabase } from '../services/supbaseClient'; // Verify this path matches your file structure
import { MapPin, Calendar, DollarSign, CheckCircle, CreditCard, PlayCircle, Loader2 } from 'lucide-react';

interface JobCardProps {
  job: any;
  role: 'CLIENT' | 'PROVIDER';
  onAction?: (action: string) => void; 
}

const JobCard: React.FC<JobCardProps> = ({ job, role, onAction }) => {
  const [loadingPay, setLoadingPay] = useState(false);

  // --- STRIPE PAYMENT LOGIC ---
  const handleStripePay = async () => {
    setLoadingPay(true);
    try {
      // 1. Call your secure Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          jobId: job.id,
          price: job.price,
          serviceName: job.service_type || "Service Request",
          // Redirect back to dashboard after payment
          successUrl: `${window.location.origin}/client-dashboard`,
          cancelUrl: `${window.location.origin}/client-dashboard`,
        },
      });

      if (error) throw error;

      // 2. Redirect user to the secure Stripe URL
      if (data?.url) {
        window.location.href = data.url;
      }
      
    } catch (err: any) {
      console.error("Payment failed:", err);
      alert("Payment initialization failed: " + err.message);
      setLoadingPay(false);
    }
  };

  // --- RENDER PROVIDER BUTTONS ---
  const renderProviderAction = () => {
    if (role !== 'PROVIDER' || !onAction) return null;

    if (job.status === 'OPEN') {
      return (
        <button onClick={() => onAction('accept')} className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2">
          <CheckCircle size={18} /> Accept Job
        </button>
      );
    }
    if (job.status === 'ASSIGNED') {
      return (
        <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg font-medium text-center text-sm border border-blue-200 flex items-center justify-center">
                Accepted
            </div>
            <button onClick={() => onAction('start')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <PlayCircle size={18} /> Start Work
            </button>
        </div>
      );
    }
    if (job.status === 'IN_PROGRESS') {
      return (
        <button onClick={() => onAction('complete')} className="w-full mt-4 bg-slate-900 text-white py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2">
          <CheckCircle size={18} /> Mark Complete
        </button>
      );
    }
    // Provider View of Completed Job
    if (job.status === 'COMPLETED') {
        return (
            <div className={`w-full mt-4 py-2 rounded-lg font-medium text-center border ${
                job.payment_status === 'PAID' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
                {job.payment_status === 'PAID' ? '✅ Payment Received' : 'Job Completed'}
            </div>
        );
    }
  };

  // --- RENDER CLIENT BUTTONS (PAYMENT) ---
  const renderClientAction = () => {
    if (role !== 'CLIENT') return null;

    // Only show "Pay Now" if job is COMPLETED but NOT YET PAID
    if (job.status === 'COMPLETED' && job.payment_status !== 'PAID') {
        return (
            <button 
                onClick={handleStripePay}
                disabled={loadingPay}
                className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md flex justify-center items-center gap-2 transition-all"
            >
                {loadingPay ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Pay Now (${job.price})</>}
            </button>
        );
    }

    // Show Receipt Badge if Paid
    if (job.payment_status === 'PAID') {
        return (
            <div className="mt-4 w-full bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg font-bold text-center flex justify-center items-center gap-2">
                <CheckCircle size={18} /> Paid in Full
            </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {job.status}
          </div>
          <div className="text-2xl font-bold text-slate-900 flex items-center">
            <DollarSign size={18} className="text-green-500 mr-1" />
            {job.price}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 capitalize">
            {job.service_type || job.title || 'Service Request'}
        </h3>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-3">
            {job.description}
        </p>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            <span className="truncate">{job.address || job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <span>{new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Render the appropriate buttons based on Role */}
      {renderProviderAction()}
      {renderClientAction()}
    </div>
  );
};

export default JobCard;
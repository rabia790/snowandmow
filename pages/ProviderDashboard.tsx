import React, { useState, useEffect } from 'react'; 
import { useStore } from '../context/StoreContext';
import JobCard from '../components/JobCard';
import { Job } from '../types';
import { ToggleLeft, ToggleRight, Map, List } from 'lucide-react';
import { supabase } from '@/services/supbaseClient';

const ProviderDashboard: React.FC = () => {
  const { user, availableJobs, myJobs, updateJobStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'MARKET' | 'MY_JOBS'>('MARKET');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-jobs-dashboard')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'jobs' },
        (payload: any) => {
          console.log('New Job:', payload.new);
          
          alert(`New job available: ${payload.new.service_type} at ${payload.new.address}`);
          
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleJobAction = (jobId: string, action: string) => {
      if (!user) return;
      if (action === 'accept') updateJobStatus(jobId, 'ACCEPTED', user.id);
      if (action === 'start') updateJobStatus(jobId, 'IN_PROGRESS');
      if (action === 'complete') updateJobStatus(jobId, 'COMPLETED');
  };

  return (
    <div>
        {/* Status Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex justify-between items-center shadow-lg">
            <div>
                <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>
                <div className="flex items-center mt-2 space-x-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wide">Earnings Today</span>
                        <span className="text-xl font-mono text-green-400">$120.50</span>
                    </div>
                    <div className="w-px h-8 bg-slate-700" />
                    <div className="flex flex-col">
                         <span className="text-xs text-slate-400 uppercase tracking-wide">Rating</span>
                        <span className="text-xl font-bold text-yellow-400">4.8 ★</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => setIsOnline(!isOnline)}
                className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-full border border-slate-700"
            >
                <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-slate-400'}`}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
                {isOnline ? <ToggleRight className="text-green-400" size={32} /> : <ToggleLeft className="text-slate-400" size={32} />}
            </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-slate-200 mb-6">
            <button 
                onClick={() => setActiveTab('MARKET')}
                className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'MARKET' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
                New Requests
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{availableJobs.length}</span>
                {activeTab === 'MARKET' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
            </button>
            <button 
                onClick={() => setActiveTab('MY_JOBS')}
                className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'MY_JOBS' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
                My Schedule
                <span className="ml-2 bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full">
                    {myJobs.filter(j => j.status !== 'COMPLETED').length}
                </span>
                {activeTab === 'MY_JOBS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
            </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'MARKET' ? (
                availableJobs.length > 0 ? (
                    availableJobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            role="PROVIDER" 
                            onAction={(action) => handleJobAction(job.id, action)} 
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        No new jobs available in your area right now.
                    </div>
                )
            ) : (
                myJobs.length > 0 ? (
                    myJobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            role="PROVIDER" 
                            onAction={(action) => handleJobAction(job.id, action)} 
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        You haven't accepted any jobs yet. Check the market!
                    </div>
                )
            )}
        </div>
    </div>
  );
};

export default ProviderDashboard;
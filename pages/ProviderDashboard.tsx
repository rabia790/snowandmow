import React, { useState, useEffect } from 'react'; 
import { useStore } from '../context/StoreContext';
import { supabase } from '../services/supbaseClient'; // Import Supabase
import JobCard from '../components/JobCard';
import { ToggleLeft, ToggleRight, Loader2, MapPin, Search } from 'lucide-react';

const ProviderDashboard: React.FC = () => {
  const { user } = useStore();
  
  // Local State for Data
  const [marketJobs, setMarketJobs] = useState<any[]>([]); // New Requests
  const [mySchedule, setMySchedule] = useState<any[]>([]); // My Accepted Jobs
  const [loading, setLoading] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState<'MARKET' | 'MY_JOBS'>('MARKET');
  const [isOnline, setIsOnline] = useState(true);
  const [locationFilter, setLocationFilter] = useState('');

  // --- 1. FETCH DATA ---
  const fetchJobs = async () => {
    setLoading(true);

    // A. Fetch Market (Open Jobs)
    let marketQuery = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'OPEN')
      .is('provider_id', null);

    // Apply Location Filter if typed
    if (locationFilter.trim()) {
        marketQuery = marketQuery.ilike('address', `%${locationFilter}%`);
    }

    const { data: marketData } = await marketQuery.order('created_at', { ascending: false });
    setMarketJobs(marketData || []);

    // B. Fetch My Schedule (Jobs assigned to ME)
    if (user) {
        const { data: myData } = await supabase
          .from('jobs')
          .select('*')
          .eq('provider_id', user.id)
          .neq('status', 'OPEN') // Get everything that isn't just "Open"
          .order('created_at', { ascending: false });
        
        setMySchedule(myData || []);
    }

    setLoading(false);
  };

  // Initial Load
  useEffect(() => {
    fetchJobs();
  }, [user, locationFilter]); // Refetch if user logs in or filter changes


  // --- 2. REALTIME SUBSCRIPTION ---
  useEffect(() => {
    const channel = supabase
      .channel('realtime-jobs-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload: any) => {
          // If a new job is added, or a job status changes, refresh the list
          console.log('Realtime update:', payload);
          if (payload.eventType === 'INSERT') {
             alert(`New Request: ${payload.new.service_type} at ${payload.new.address}`);
          }
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  // --- 3. HANDLE ACTIONS (Accept, Start, Complete) ---
  const handleJobAction = async (jobId: string, action: string) => {
      if (!user) return;
      
      let updates = {};

      if (action === 'accept') {
          updates = { status: 'ASSIGNED', provider_id: user.id };
      } else if (action === 'start') {
          updates = { status: 'IN_PROGRESS' };
      } else if (action === 'complete') {
          updates = { status: 'COMPLETED' };
      } else {
          return;
      }

      const { error } = await supabase
          .from('jobs')
          .update(updates)
          .eq('id', jobId);

      if (error) {
          alert("Error updating job: " + error.message);
      } else {
          // If accepted, switch tab to show "My Schedule"
          if (action === 'accept') setActiveTab('MY_JOBS');
          fetchJobs(); // Refresh UI
      }
  };

const grossRevenue = React.useMemo(() => {
    // Sum the job.price for ALL jobs marked 'COMPLETED' by this provider
    const totalGross = mySchedule.reduce((sum, job) => {
        // We only care if the job workflow is complete
        if (job.status === 'COMPLETED') {
            // Safely convert the job's price (client's payment) to a number
            const jobPrice = parseFloat(job.price) || 0;
            return sum + jobPrice; 
        }
        return sum;
    }, 0);

    return totalGross.toFixed(2);
}, [mySchedule]);



  return (
    <div>
        {/* Status Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
            <div>
                <h1 className="text-2xl font-bold">Hello, {user?.name || 'Provider'}</h1>
                <div className="flex items-center mt-2 space-x-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wide">Earnings Today</span>
                        <span className="text-xl font-mono text-green-400">CA${grossRevenue}</span>
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
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{marketJobs.length}</span>
                {activeTab === 'MARKET' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
            </button>
            <button 
                onClick={() => setActiveTab('MY_JOBS')}
                className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'MY_JOBS' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
                My Schedule
                <span className="ml-2 bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full">
                    {mySchedule.filter(j => j.status !== 'COMPLETED').length}
                </span>
                {activeTab === 'MY_JOBS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
            </button>
        </div>

        {/* Location Filter (Only visible on Market Tab) */}
        {activeTab === 'MARKET' && (
            <div className="mb-6 flex gap-2">
                <div className="relative flex-1 max-w-md">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Filter by city (e.g. Toronto)" 
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                </div>
                <button onClick={() => fetchJobs()} className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200">
                    <Search size={20} className="text-slate-600" />
                </button>
            </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                 <div className="col-span-full py-20 flex justify-center">
                    <Loader2 className="animate-spin text-slate-400" />
                 </div>
            ) : activeTab === 'MARKET' ? (
                // --- MARKET TAB CONTENT ---
                marketJobs.length > 0 ? (
                    marketJobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            role="PROVIDER" 
                            onAction={(action) => handleJobAction(job.id, action)} 
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        No new jobs available in this area right now.
                    </div>
                )
            ) : (
                // --- MY JOBS TAB CONTENT ---
                mySchedule.length > 0 ? (
                    mySchedule.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            role="PROVIDER" 
                            onAction={(action) => handleJobAction(job.id, action)} 
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        You haven't accepted any jobs yet. Check the "New Requests" tab!
                    </div>
                )
            )}
        </div>
    </div>
  );
};

export default ProviderDashboard;
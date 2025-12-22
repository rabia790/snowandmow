import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../services/supbaseClient'; // 1. Import Supabase
import { SERVICE_OPTIONS_LAWN, SERVICE_OPTIONS_SNOW } from '../constants';
import { ServiceCategory, Address } from '../types';
import JobCard from '../components/JobCard';
import { Snowflake, Sun, MapPin, Plus, Loader2 } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { user } = useStore(); 
  const [view, setView] = useState<'LIST' | 'BOOKING'>('LIST');

  // Local state for Supabase Jobs
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Booking Form State
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ServiceCategory>('SNOW');
  const [serviceType, setServiceType] = useState<string>('');
  const [price, setPrice] = useState(0);
  const [address, setAddress] = useState<Address>({
      id: 'new', street: '', city: '', zip: '', type: 'HOME'
  });
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // --- 1. FETCH JOBS FROM DB (Replace 'myJobs' from store) ---
  useEffect(() => {
    if (user) fetchMyJobs();
  }, [user, view]); 


  const fetchMyJobs = async () => {
    // Select jobs where client_id equals YOUR user ID
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) console.error("Error loading jobs:", error);
    else setJobs(data || []);
  };

useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_status') === 'success';
    const paidJobId = params.get('job_id'); 

    if (paymentSuccess && paidJobId) {
        window.history.replaceState({}, document.title, window.location.pathname);
        const updateJobStatus = async () => {
            const { error } = await supabase
                .from('jobs') 
                .update({ payment_status: 'PAID' }) 
                .eq('id', paidJobId);

            if (error) {
                console.error("Failed to update database:", error);
            } else {
                fetchMyJobs(); 
            }
        };

        updateJobStatus();
    }
}, [user]); 

const handleCreate = async () => {
    if (!user) {
        alert("Please log in again.");
        return;
    }
    setIsLoading(true);

    // 1. Prepare data to match your database columns
    const fullAddress = `${address.street}, ${address.city}`; // Maps to 'address'
    const fullDescription = `Category: ${category}. Date Scheduled: ${date}`; // Maps to 'description'

    // 2. Send to Supabase
    const { error } = await supabase.from('jobs').insert([
      {
        client_id: user.id,           // Maps to 'client_id'
        provider_id: null,            // Maps to 'provider_id' (starts empty)
        service_type: serviceType,    // Maps to 'service_type' (e.g. "Driveway Clearing")
        status: 'OPEN',               // Maps to 'status'
        address: fullAddress,         // Maps to 'address'
        price: price,                 // Maps to 'price'
        description: fullDescription  // Maps to 'description'
      }
    ]);

    setIsLoading(false);

    if (error) {
      console.error("Supabase Error:", error);
      alert('Error creating booking: ' + error.message);
    } else {
      alert('Job posted successfully!');
      setView('LIST');
      setStep(1);
      
      // Reset form
      setServiceType('');
      setAddress({ id: 'new', street: '', city: '', zip: '', type: 'HOME' });
      
      // Refresh your list
      fetchMyJobs();
    }
  };

  if (view === 'BOOKING') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Book Service</h2>
            <button onClick={() => setView('LIST')} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-slate-900' : 'bg-slate-200'}`} />
            ))}
        </div>

        {/* STEP 1: Service Type */}
        {step === 1 && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setCategory('SNOW')}
                        className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${category === 'SNOW' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <Snowflake className={`w-8 h-8 ${category === 'SNOW' ? 'text-blue-500' : 'text-slate-400'}`} />
                        <span className="font-semibold text-slate-700">Snow Removal</span>
                    </button>
                    <button 
                        onClick={() => setCategory('LAWN')}
                        className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${category === 'LAWN' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <Sun className={`w-8 h-8 ${category === 'LAWN' ? 'text-green-500' : 'text-slate-400'}`} />
                        <span className="font-semibold text-slate-700">Lawn Care</span>
                    </button>
                </div>

                <div className="space-y-3">
                    <h3 className="font-medium text-slate-900">Select Package</h3>
                    {(category === 'SNOW' ? SERVICE_OPTIONS_SNOW : SERVICE_OPTIONS_LAWN).map(opt => (
                        <div 
                            key={opt.id}
                            onClick={() => { setServiceType(opt.label); setPrice(opt.basePrice); }}
                            className={`p-4 rounded-lg border cursor-pointer flex justify-between items-center ${serviceType === opt.label ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div>
                                <div className="font-medium text-slate-900">{opt.label}</div>
                                <div className="text-sm text-slate-500">{opt.description}</div>
                            </div>
                            <div className="font-bold">${opt.basePrice}</div>
                        </div>
                    ))}
                </div>
                <button 
                    disabled={!serviceType}
                    onClick={() => setStep(2)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium disabled:opacity-50 hover:bg-slate-800"
                >
                    Next Step
                </button>
            </div>
        )}

        {/* STEP 2: Address & Time */}
        {step === 2 && (
            <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                    <input 
                        type="text" 
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="123 Main St"
                        value={address.street}
                        onChange={e => setAddress({...address, street: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg"
                            value={address.city}
                            onChange={e => setAddress({...address, city: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                        <input 
                            type="date" 
                            className="w-full p-3 border border-slate-300 rounded-lg"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>
                 </div>
                 <button 
                    disabled={!address.street}
                    onClick={() => setStep(3)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium disabled:opacity-50 hover:bg-slate-800"
                >
                    Review & Pay
                </button>
            </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
            <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                    <div className="flex justify-between border-b border-slate-200 pb-4">
                        <span className="text-slate-500">Service</span>
                        <span className="font-medium">{serviceType} ({category})</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-4">
                        <span className="text-slate-500">Address</span>
                        <span className="font-medium text-right">{address.street}, {address.city}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-4">
                        <span className="text-slate-500">Date</span>
                        <span className="font-medium text-right">{date}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total Estimate</span>
                        <span>C${price.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                    <div className="p-1 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                        <MapPin size={16} />
                    </div>
                    <p className="text-sm text-blue-800">
                        A provider will be assigned based on your location. You will be notified once accepted.
                    </p>
                </div>

                <button 
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all flex justify-center items-center"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                </button>
            </div>
        )}

      </div>
    );
  }

  // --- MAIN DASHBOARD VIEW ---
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Properties</h1>
          <p className="text-slate-500">Manage your bookings and track status.</p>
        </div>
        <button 
            onClick={() => setView('BOOKING')}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
        >
            <Plus size={20} />
            <span>New Booking</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Snowflake className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No bookings yet</h3>
                <p className="text-slate-500 mb-6">Get prepared for the season.</p>
                <button onClick={() => setView('BOOKING')} className="text-blue-600 font-medium hover:underline">
                    Book your first service
                </button>
            </div>
        ) : (
            // Map over the REAL SUPABASE jobs data
            jobs.map(job => (
                <JobCard key={job.id} job={job} role="CLIENT" />
            ))
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
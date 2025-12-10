import React from 'react';
import { Job, UserRole } from '../types';
import { MapPin, Calendar, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface JobCardProps {
  job: Job;
  role: UserRole;
  onAction?: (action: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, role, onAction }) => {
  const isSnow = job.category === 'SNOW';
  const statusColor = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'ACCEPTED': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-purple-100 text-purple-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
  }[job.status];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-2 w-full ${isSnow ? 'bg-blue-500' : 'bg-green-500'}`} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
              {job.status.replace('_', ' ')}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{job.serviceType}</h3>
            <div className="flex items-center text-slate-500 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              {job.address.street}, {job.address.city}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-slate-900">${job.price}</span>
            <span className="text-xs text-slate-500 uppercase">{job.category}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-slate-600">
             <Calendar size={16} className="mr-2 text-slate-400" />
             {new Date(job.dateScheduled).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-slate-600">
             <Clock size={16} className="mr-2 text-slate-400" />
             {new Date(job.dateScheduled).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>

        {role === 'PROVIDER' && job.status === 'PENDING' && (
          <button 
            onClick={() => onAction && onAction('accept')}
            className="w-full mt-2 bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Accept Job
          </button>
        )}

        {role === 'PROVIDER' && job.status === 'ACCEPTED' && (
           <button 
           onClick={() => onAction && onAction('start')}
           className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
         >
           Start Job
         </button>
        )}

        {role === 'PROVIDER' && job.status === 'IN_PROGRESS' && (
           <button 
           onClick={() => onAction && onAction('complete')}
           className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
         >
           Complete Job
         </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext'; // <--- Use Store, not Supabase
import { UserRole } from '../types';
import { Shovel, User, ArrowLeft, Mail, Lock, User as UserIcon, Loader2, ChevronRight } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { authenticate, register } = useStore(); // <--- Get auth functions from Store
  
  // State for flow control
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!selectedRole) {
        setError("Please select a role first.");
        setIsLoading(false);
        return;
      }

      if (authMode === 'LOGIN') {    
        // 1. USE STORE AUTHENTICATE
        const result = await authenticate(formData.email, formData.password);
        
        if (result.success) {
           // 2. NAVIGATE BASED ON ROLE
           if (selectedRole === 'PROVIDER') navigate('/provider-dashboard');
           else if (selectedRole === 'CLIENT') navigate('/client-dashboard');
           else if (selectedRole === 'ADMIN') navigate('/admin-dashboard');
        } else {
           setError(result.message || "Login failed");
        }

      } else {
        // 3. USE STORE REGISTER
        const success = await register(formData.name, formData.email, formData.password, selectedRole);
        
        if (success) {
           alert('Account created successfully!');
           if (selectedRole === 'PROVIDER') navigate('/provider-dashboard');
           else navigate('/client-dashboard');
        } else {
           setError("Registration failed. Email might be taken.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for quick demo login
  const fillDemoCreds = () => {
    if (selectedRole === 'CLIENT') {
        setFormData({ ...formData, email: 'alice@example.com', password: 'password' });
    } else if (selectedRole === 'PROVIDER') {
        setFormData({ ...formData, email: 'bob@example.com', password: 'password' });
    } else if (selectedRole === 'ADMIN') {
        setFormData({ ...formData, email: 'admin@example.com', password: 'password' });
    }
  };

  // 1. Landing Screen - Role Selection
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Welcome to Snow & Mow
            </h1>
            <p className="text-xl text-slate-500">The on-demand platform for seasonal home services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Client Card */}
            <button 
              onClick={() => setSelectedRole('CLIENT')}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 hover:scale-105 transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <User size={120} className="text-blue-600" />
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:rotate-6 transition-transform">
                <User size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">I'm a Homeowner</h2>
              <p className="text-slate-500 mb-6">Book snow removal or lawn care services instantly for your property.</p>
              <div className="flex items-center text-blue-600 font-medium">
                Get Started <ChevronRight size={20} className="ml-1" />
              </div>
            </button>

            {/* Provider Card */}
            <button 
              onClick={() => setSelectedRole('PROVIDER')}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-green-500 hover:scale-105 transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shovel size={120} className="text-green-600" />
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:-rotate-6 transition-transform">
                <Shovel size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">I'm a Provider</h2>
              <p className="text-slate-500 mb-6">Find jobs nearby, manage your schedule, and grow your business.</p>
              <div className="flex items-center text-green-600 font-medium">
                Join Network <ChevronRight size={20} className="ml-1" />
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => { setSelectedRole('ADMIN'); fillDemoCreds(); }} className="text-sm text-slate-400 hover:text-slate-600">
              Admin Portal Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Auth Form Screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <button 
          onClick={() => { setSelectedRole(null); setError(''); setFormData({name:'', email:'', password:''}); }}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="pt-12 pb-8 px-8 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${selectedRole === 'CLIENT' ? 'bg-blue-100 text-blue-600' : selectedRole === 'PROVIDER' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
            {selectedRole === 'CLIENT' ? <User size={32} /> : selectedRole === 'PROVIDER' ? <Shovel size={32} /> : <Lock size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {authMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {selectedRole === 'CLIENT' ? 'Homeowner Portal' : selectedRole === 'PROVIDER' ? 'Provider Portal' : 'Admin Portal'}
          </p>
        </div>

        {/* Tabs */}
        {selectedRole !== 'ADMIN' && (
            <div className="flex border-b border-slate-100 px-8">
                <button 
                    onClick={() => { setAuthMode('LOGIN'); setError(''); }}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${authMode === 'LOGIN' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Log In
                    {authMode === 'LOGIN' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900" />}
                </button>
                <button 
                    onClick={() => { setAuthMode('SIGNUP'); setError(''); }}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${authMode === 'SIGNUP' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Sign Up
                    {authMode === 'SIGNUP' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900" />}
                </button>
            </div>
        )}

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field (Signup Only) */}
            {authMode === 'SIGNUP' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  minLength={3}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                 {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center ${selectedRole === 'CLIENT' ? 'bg-blue-600 hover:bg-blue-700' : selectedRole === 'PROVIDER' ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-800'}`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                authMode === 'LOGIN' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Demo Helper */}
          {authMode === 'LOGIN' && (selectedRole === 'CLIENT' || selectedRole === 'PROVIDER' || selectedRole === 'ADMIN') && (
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <button 
                    type="button"
                    onClick={fillDemoCreds}
                    className="text-xs text-slate-400 hover:text-blue-600 hover:underline"
                >
                    Auto-fill demo credentials
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
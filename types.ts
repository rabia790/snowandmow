export type UserRole = 'CLIENT' | 'PROVIDER' | 'ADMIN';

export type ServiceCategory = 'SNOW' | 'LAWN';

export type JobStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Address {
  id: string;
  street: string;
  city: string;
  zip: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  // Provider specific
  rating?: number;
  completedJobs?: number;
  isOnline?: boolean;
}

export interface Job {
  id: string;
  clientId: string;
  providerId?: string;
  category: ServiceCategory;
  serviceType: string; // e.g., "Driveway Only", "Full Cut"
  status: JobStatus;
  address: Address;
  price: number;
  dateScheduled: string; // ISO string
  notes?: string;
  createdAt: string;
  images?: string[];
}

export interface ServiceOption {
  id: string;
  label: string;
  basePrice: number;
  description: string;
}
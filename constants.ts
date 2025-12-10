import { ServiceOption, User, Job } from './types';

export const SERVICE_OPTIONS_SNOW: ServiceOption[] = [
  { id: 'snow-driveway', label: 'Driveway Only', basePrice: 40, description: 'Clearance of main driveway area.' },
  { id: 'snow-full', label: 'Driveway + Walkway', basePrice: 60, description: 'Includes front steps and walkway to door.' },
  { id: 'snow-salt', label: 'Salting Add-on', basePrice: 15, description: 'Application of eco-friendly de-icer.' },
];

export const SERVICE_OPTIONS_LAWN: ServiceOption[] = [
  { id: 'lawn-mow', label: 'Standard Mow', basePrice: 50, description: 'Mowing and grass clipping removal.' },
  { id: 'lawn-edge', label: 'Mow & Edge', basePrice: 70, description: 'Standard mow plus precision edging.' },
  { id: 'lawn-full', label: 'Full Care', basePrice: 100, description: 'Mow, edge, and hedge trimming.' },
];

export const MOCK_USER_CLIENT: User = {
  id: 'c1',
  name: 'Alice Homeowner',
  email: 'alice@example.com',
  role: 'CLIENT',
  avatarUrl: 'https://picsum.photos/100/100',
};

export const MOCK_USER_PROVIDER: User = {
  id: 'p1',
  name: 'Bob Builder',
  email: 'bob@example.com',
  role: 'PROVIDER',
  avatarUrl: 'https://picsum.photos/101/101',
  rating: 4.8,
  completedJobs: 124,
  isOnline: true,
};

export const MOCK_USER_ADMIN: User = {
  id: 'a1',
  name: 'Admin User',
  email: 'admin@platform.com',
  role: 'ADMIN',
  avatarUrl: 'https://picsum.photos/102/102',
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    clientId: 'c1',
    category: 'SNOW',
    serviceType: 'Driveway + Walkway',
    status: 'COMPLETED',
    address: { id: 'addr1', street: '123 Maple Ave', city: 'Toronto', zip: 'M5V 2T6', type: 'HOME' },
    price: 60,
    dateScheduled: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 90000000).toISOString(),
  },
  {
    id: 'j2',
    clientId: 'c1',
    category: 'LAWN',
    serviceType: 'Standard Mow',
    status: 'PENDING',
    address: { id: 'addr1', street: '123 Maple Ave', city: 'Toronto', zip: 'M5V 2T6', type: 'HOME' },
    price: 50,
    dateScheduled: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 100000).toISOString(),
  },
];
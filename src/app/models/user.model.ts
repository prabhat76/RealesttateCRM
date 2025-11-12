export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'admin' | 'agent' | 'viewer' | 'buyer' | 'seller';
  phone?: string;
  avatar?: string;
  organizationId?: string;
  organizationRole?: 'owner' | 'admin' | 'agent' | 'viewer';
  permissions?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'agent' | 'buyer' | 'seller';
  organizationName?: string;
  organizationType?: 'agency' | 'brokerage' | 'individual';
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'condo' | 'land' | 'commercial';
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number; // in sqft
  images: string[];
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  agentId: string;
  type: 'sale' | 'rental' | 'mortgage';
  amount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

export interface MortgageApplication {
  id: string;
  propertyId: string;
  userId: string;
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // in years
  monthlyPayment: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

// Connection Types
export interface Connection {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  linkedinUsername?: string;
  githubUsername?: string;
  notes?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Company Types
export interface Company {
  _id?: string;
  name: string;
  industry?: string;
  website?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Position Types
export interface Position {
  _id?: string;
  connectionId: string;
  companyId: string;
  title: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
  notes?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Search Types
export interface SearchResult {
  type: "connection" | "company";
  id: string;
  name: string;
  subtitle?: string;
}

// Form Types
export interface ConnectionFormData {
  name: string;
  email: string;
  phone: string;
  linkedinUsername: string;
  githubUsername: string;
  notes: string;
}

export interface CompanyFormData {
  name: string;
  industry: string;
  website: string;
}

export interface PositionFormData {
  connectionId: string;
  companyId: string;
  title: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  notes: string;
}

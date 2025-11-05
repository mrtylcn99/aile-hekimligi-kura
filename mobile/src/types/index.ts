// Global type definitions for the application

export interface User {
  id: string;
  tcKimlik: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  province?: string;
  district?: string;
  address?: string;
  avatar?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Kura {
  id: string;
  title: string;
  description: string;
  province: string;
  district: string;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  status: "active" | "closed" | "completed";
  positions: Position[];
  requirements: string[];
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  workingHours: string;
  contractType: string;
  available: boolean;
}

export interface Application {
  id: string;
  userId: string;
  kuraId: string;
  positionId: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
  documents: ApplicationDocument[];
  score?: number;
  ranking?: number;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  data?: any;
}

export interface Province {
  id: string;
  name: string;
  code: string;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  code: string;
  provinceId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  query?: string;
  province?: string;
  district?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type:
    | "application_deadline"
    | "kura_date"
    | "result_announcement"
    | "reminder";
  relatedId?: string;
  color: string;
}

export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
  base64?: string;
}

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

export interface DeepLinkParams {
  screen?: string;
  params?: Record<string, any>;
}

export interface BackgroundSyncTask {
  id: string;
  type: "upload" | "download" | "sync";
  data: any;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
}

export interface ExportOptions {
  format: "pdf" | "excel" | "csv";
  data: any[];
  filename: string;
  options?: {
    includeHeaders?: boolean;
    dateFormat?: string;
    currency?: string;
  };
}

export interface ShareContent {
  title?: string;
  message?: string;
  url?: string;
  type?: "text" | "image" | "file";
  filePath?: string;
}

export interface AppUpdate {
  version: string;
  buildNumber: number;
  releaseNotes: string;
  downloadUrl: string;
  mandatory: boolean;
  releaseDate: string;
}

// Interfaces dos modelos de dados
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  lastContact: string;
  notes: string;
  projectsCount: number;
}

export interface Material {
  id: number;
  name: string;
  type: string;
  currentStock: number;
  minStock: number;
  unitCost: number;
  unitPrice: number;
  supplier: string;
  colors: string[];
  lastPurchase?: string;
  totalValue: number;
  isLowStock: boolean;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  customerId: number;
  customerName: string;
  status: string;
  area: number;
  cost: number;
  progress: number;
  deadline?: string;
  location: string;
  createdAt: string;
}

export interface Quote {
  id: number;
  number: string;
  customerId: number;
  customerName: string;
  projectId?: number;
  projectName: string;
  status: string;
  value: number;
  validUntil: string;
  createdAt: string;
  items: QuoteItem[];
}

export interface QuoteItem {
  id: number;
  materialId?: number;
  name: string;
  quantity: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  number: string;
  customerId: number;
  customerName: string;
  projectId?: number;
  projectName: string;
  status: string;
  value: number;
  deadline?: string;
  progress: number;
  createdAt: string;
}

export interface ScheduleEvent {
  id: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  type: string;
  status: string;
  customerId?: number;
  customerName: string;
  projectId?: number;
  projectName: string;
  location: string;
  isAllDay: boolean;
  notes: string;
}

// Interfaces de autenticação
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

// Interfaces de dashboard
export interface DashboardStats {
  customersCount: number;
  projectsCount: number;
  activeProjectsCount: number;
  ordersCount: number;
  pendingOrdersCount: number;
  quotesCount: number;
  materialsCount: number;
  lowStockMaterialsCount: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

// Tipos de formulários
export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
}

export interface MaterialFormData {
  name: string;
  type: string;
  currentStock: number;
  minStock: number;
  unitCost: number;
  unitPrice: number;
  supplier: string;
  colors: string[];
}

export interface ProjectFormData {
  name: string;
  description: string;
  customerId: number;
  status: string;
  area: number;
  cost: number;
  deadline?: string;
  location: string;
}
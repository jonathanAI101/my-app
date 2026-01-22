export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // 单位：分（避免浮点数问题）
}

export interface Client {
  name: string;
  email: string;
  address?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-2024-0001 格式

  // 客户信息
  client: Client;

  // 明细
  items: LineItem[];

  // 金额（单位：分）
  subtotal: number;
  taxRate: number; // 0.06 = 6%
  taxAmount: number;
  total: number;

  // 时间
  issueDate: string; // ISO 8601
  dueDate: string;
  paidDate?: string;

  // 状态
  status: InvoiceStatus;

  // 元数据
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  invoiceCount: number;
  paidCount: number;
  overdueCount: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus | 'all';
  search?: string;
  startDate?: string;
  endDate?: string;
}

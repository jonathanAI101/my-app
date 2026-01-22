'use client';

import { create } from 'zustand';
import type { Invoice, InvoiceStatus, InvoiceFilters, InvoiceStats } from '@/types/invoice';
import { mockInvoices, getInvoiceStats } from '@/data/mockInvoices';
import { generateId, generateInvoiceNumber, calculateSubtotal, calculateTax, calculateTotal } from '@/utils/format';

interface InvoiceStore {
  // 数据
  invoices: Invoice[];
  filters: InvoiceFilters;

  // 计算属性
  filteredInvoices: () => Invoice[];
  stats: () => InvoiceStats;
  getInvoiceById: (id: string) => Invoice | undefined;

  // 操作
  setFilters: (filters: Partial<InvoiceFilters>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt' | 'subtotal' | 'taxAmount' | 'total'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateStatus: (id: string, status: InvoiceStatus) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: mockInvoices,
  filters: {
    status: 'all',
    search: '',
  },

  filteredInvoices: () => {
    const { invoices, filters } = get();
    return invoices.filter((invoice) => {
      // 状态筛选
      if (filters.status && filters.status !== 'all' && invoice.status !== filters.status) {
        return false;
      }

      // 搜索筛选
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchNumber = invoice.invoiceNumber.toLowerCase().includes(search);
        const matchClient = invoice.client.name.toLowerCase().includes(search);
        if (!matchNumber && !matchClient) {
          return false;
        }
      }

      // 日期范围筛选
      if (filters.startDate) {
        const issueDate = new Date(invoice.issueDate);
        const startDate = new Date(filters.startDate);
        if (issueDate < startDate) {
          return false;
        }
      }

      if (filters.endDate) {
        const issueDate = new Date(invoice.issueDate);
        const endDate = new Date(filters.endDate);
        if (issueDate > endDate) {
          return false;
        }
      }

      return true;
    });
  },

  stats: () => {
    const { invoices } = get();
    const stats: InvoiceStats = {
      totalRevenue: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      invoiceCount: invoices.length,
      paidCount: 0,
      overdueCount: 0,
    };

    invoices.forEach((invoice) => {
      if (invoice.status === 'paid') {
        stats.totalRevenue += invoice.total;
        stats.paidCount++;
      } else if (invoice.status === 'pending') {
        stats.pendingAmount += invoice.total;
      } else if (invoice.status === 'overdue') {
        stats.overdueAmount += invoice.total;
        stats.overdueCount++;
      }
    });

    return stats;
  },

  getInvoiceById: (id: string) => {
    return get().invoices.find((invoice) => invoice.id === id);
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  addInvoice: (invoiceData) => {
    const subtotal = calculateSubtotal(invoiceData.items);
    const taxAmount = calculateTax(subtotal, invoiceData.taxRate);
    const total = calculateTotal(subtotal, taxAmount);

    const newInvoice: Invoice = {
      ...invoiceData,
      id: generateId(),
      invoiceNumber: generateInvoiceNumber(),
      subtotal,
      taxAmount,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
    }));

    return newInvoice;
  },

  updateInvoice: (id, updates) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) => {
        if (invoice.id !== id) return invoice;

        const updated = { ...invoice, ...updates };

        // 如果更新了明细项或税率，重新计算金额
        if (updates.items || updates.taxRate !== undefined) {
          updated.subtotal = calculateSubtotal(updated.items);
          updated.taxAmount = calculateTax(updated.subtotal, updated.taxRate);
          updated.total = calculateTotal(updated.subtotal, updated.taxAmount);
        }

        updated.updatedAt = new Date().toISOString();
        return updated;
      }),
    }));
  },

  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
    }));
  },

  updateStatus: (id, status) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) => {
        if (invoice.id !== id) return invoice;
        return {
          ...invoice,
          status,
          paidDate: status === 'paid' ? new Date().toISOString() : invoice.paidDate,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },
}));

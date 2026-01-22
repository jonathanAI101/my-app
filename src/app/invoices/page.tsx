'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { InvoiceTable } from '@/components/invoice/InvoiceTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import type { InvoiceStatus } from '@/types/invoice';

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'pending', label: '待付款' },
  { value: 'paid', label: '已付款' },
  { value: 'overdue', label: '已逾期' },
  { value: 'cancelled', label: '已取消' },
];

const PAGE_SIZE = 10;

export default function InvoicesPage() {
  const { filteredInvoices, setFilters, filters, updateStatus, deleteInvoice } =
    useInvoiceStore();
  const [currentPage, setCurrentPage] = useState(1);

  const invoices = filteredInvoices();
  const totalPages = Math.ceil(invoices.length / PAGE_SIZE);
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return invoices.slice(start, start + PAGE_SIZE);
  }, [invoices, currentPage]);

  const handleStatusFilter = (value: string) => {
    setFilters({ status: value as InvoiceStatus | 'all' });
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">发票管理</h1>
          <p className="text-muted-foreground">管理和跟踪您的所有发票</p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            新建发票
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索发票号或客户名..."
            value={filters.search || ''}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.status || 'all'}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <InvoiceTable
        invoices={paginatedInvoices}
        onDelete={deleteInvoice}
        onStatusChange={updateStatus}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            共 {invoices.length} 条，第 {currentPage}/{totalPages} 页
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

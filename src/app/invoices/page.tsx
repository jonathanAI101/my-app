'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useTableStateStore, sortInvoices, paginateData } from '@/store/tableStateStore';
import { useHydration } from '@/hooks/useHydration';
import { useI18n } from '@/i18n';
import { InvoiceTable } from '@/components/invoice/InvoiceTable';
import { ColumnToggle } from '@/components/invoice/ColumnToggle';
import { DataExportButton } from '@/components/invoice/DataExportButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { InvoiceStatus } from '@/types/invoice';

export default function InvoicesPage() {
  const { invoices, updateStatus, deleteInvoice } = useInvoiceStore();
  const {
    filters,
    sorting,
    pagination,
    setFilters,
    toggleSorting,
    setPageIndex,
    setPageSize,
    resetFilters,
  } = useTableStateStore();
  const { t, formatMessage } = useI18n();
  const hydrated = useHydration();

  const statusOptions = [
    { value: 'all', label: t.status.all },
    { value: 'draft', label: t.status.draft },
    { value: 'pending', label: t.status.pending },
    { value: 'paid', label: t.status.paid },
    { value: 'overdue', label: t.status.overdue },
    { value: 'cancelled', label: t.status.cancelled },
  ];

  const pageSizeOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ];

  // 筛选数据
  const filteredInvoices = useMemo(() => {
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
  }, [invoices, filters]);

  // 排序数据
  const sortedInvoices = useMemo(() => {
    return sortInvoices(filteredInvoices, sorting);
  }, [filteredInvoices, sorting]);

  // 分页数据
  const { paginatedData: paginatedInvoices, totalPages, totalItems } = useMemo(() => {
    return paginateData(sortedInvoices, pagination);
  }, [sortedInvoices, pagination]);

  const handleStatusFilter = (value: string) => {
    setFilters({ status: value as InvoiceStatus | 'all' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value, 10));
  };

  // 获取排序图标
  const getSortIcon = (field: string) => {
    if (sorting?.field !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground/50" />;
    }
    return sorting.direction === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  // 水合未完成时显示加载骨架
  if (!hydrated) {
    return (
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-6 flex gap-4">
          <div className="h-10 flex-1 max-w-sm animate-pulse rounded bg-muted" />
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-96 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.invoices.title}</h1>
          <p className="text-muted-foreground">{t.invoices.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <DataExportButton />
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              {t.invoices.newInvoice}
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.invoices.searchPlaceholder}
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
            <SelectValue placeholder={t.common.filter} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 排序按钮 */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSorting('issueDate')}
            className="h-9 px-3"
          >
            {t.invoices.date}
            {getSortIcon('issueDate')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSorting('total')}
            className="h-9 px-3"
          >
            {t.invoices.amount}
            {getSortIcon('total')}
          </Button>
        </div>

        {/* 列配置 */}
        <ColumnToggle />

        {/* 重置筛选 */}
        {(filters.status !== 'all' || filters.search || sorting) && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            {t.common.reset}
          </Button>
        )}
      </div>

      {/* Table */}
      <InvoiceTable
        invoices={paginatedInvoices}
        onDelete={deleteInvoice}
        onStatusChange={updateStatus}
      />

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {formatMessage(t.invoices.pagination, {
                total: totalItems,
                current: pagination.pageIndex + 1,
                pages: totalPages,
              })}
            </p>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{t.invoices.perPage}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex === 0}
            >
              {t.invoices.prevPage}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex >= totalPages - 1}
            >
              {t.invoices.nextPage}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

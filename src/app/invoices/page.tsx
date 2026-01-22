'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useI18n } from '@/i18n';
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

const PAGE_SIZE = 10;

export default function InvoicesPage() {
  const { filteredInvoices, setFilters, filters, updateStatus, deleteInvoice } =
    useInvoiceStore();
  const { t, formatMessage } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);

  const statusOptions = [
    { value: 'all', label: t.status.all },
    { value: 'draft', label: t.status.draft },
    { value: 'pending', label: t.status.pending },
    { value: 'paid', label: t.status.paid },
    { value: 'overdue', label: t.status.overdue },
    { value: 'cancelled', label: t.status.cancelled },
  ];

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
          <h1 className="text-2xl font-bold tracking-tight">{t.invoices.title}</h1>
          <p className="text-muted-foreground">{t.invoices.subtitle}</p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            {t.invoices.newInvoice}
          </Link>
        </Button>
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
            {formatMessage(t.invoices.pagination, {
              total: invoices.length,
              current: currentPage,
              pages: totalPages,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {t.invoices.prevPage}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {t.invoices.nextPage}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

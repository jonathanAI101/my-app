'use client';

import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useI18n } from '@/i18n';
import { StatsCard } from '@/components/invoice/StatsCard';
import { InvoiceTable } from '@/components/invoice/InvoiceTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { invoices, stats, updateStatus, deleteInvoice } = useInvoiceStore();
  const { t, formatMessage } = useI18n();
  const invoiceStats = stats();
  const recentInvoices = invoices.slice(0, 5);
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.dashboard.title}</h1>
          <p className="text-muted-foreground">{t.dashboard.welcome}</p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            {t.nav.newInvoice}
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t.dashboard.totalRevenue}
          value={formatCurrency(invoiceStats.totalRevenue)}
          description={formatMessage(t.dashboard.paidCount, { count: invoiceStats.paidCount })}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <StatsCard
          title={t.dashboard.pendingAmount}
          value={formatCurrency(invoiceStats.pendingAmount)}
          description={t.dashboard.waitingPayment}
          icon={Clock}
          iconColor="text-blue-600"
        />
        <StatsCard
          title={t.dashboard.overdueAmount}
          value={formatCurrency(invoiceStats.overdueAmount)}
          description={formatMessage(t.dashboard.overdueCount, { count: invoiceStats.overdueCount })}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        <StatsCard
          title={t.dashboard.totalInvoices}
          value={String(invoiceStats.invoiceCount)}
          description={t.dashboard.allInvoices}
          icon={FileText}
          iconColor="text-gray-600"
        />
      </div>

      {/* Overdue Alert */}
      {overdueInvoices.length > 0 && (
        <Card className="mb-8 border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">{t.dashboard.overdueAlert}</h3>
                <p className="text-sm text-red-700">
                  {formatMessage(t.dashboard.overdueMessage, {
                    count: overdueInvoices.length,
                    amount: formatCurrency(invoiceStats.overdueAmount),
                  })}
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" asChild>
              <Link href="/invoices?status=overdue">{t.dashboard.handleNow}</Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Recent Invoices */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.dashboard.recentInvoices}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/invoices">
              {t.dashboard.viewAll}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <InvoiceTable
          invoices={recentInvoices}
          onDelete={deleteInvoice}
          onStatusChange={updateStatus}
        />
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
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
  const invoiceStats = stats();
  const recentInvoices = invoices.slice(0, 5);
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">仪表盘</h1>
          <p className="text-muted-foreground">欢迎回来，这是您的发票概览</p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            新建发票
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="总收入"
          value={formatCurrency(invoiceStats.totalRevenue)}
          description={`${invoiceStats.paidCount} 张已付款`}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <StatsCard
          title="待收款"
          value={formatCurrency(invoiceStats.pendingAmount)}
          description="等待客户付款"
          icon={Clock}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="逾期款项"
          value={formatCurrency(invoiceStats.overdueAmount)}
          description={`${invoiceStats.overdueCount} 张已逾期`}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        <StatsCard
          title="发票总数"
          value={String(invoiceStats.invoiceCount)}
          description="所有发票"
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
                <h3 className="font-semibold text-red-900">逾期提醒</h3>
                <p className="text-sm text-red-700">
                  您有 {overdueInvoices.length} 张发票已逾期，总金额{' '}
                  {formatCurrency(invoiceStats.overdueAmount)}
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" asChild>
              <Link href="/invoices?status=overdue">立即处理</Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Recent Invoices */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">最近发票</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/invoices">
              查看全部
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

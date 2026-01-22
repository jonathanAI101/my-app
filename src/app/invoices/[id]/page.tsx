'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InvoiceStatusBadge } from '@/components/invoice/InvoiceStatusBadge';
import { formatCurrency, formatDate } from '@/utils/format';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Printer,
} from 'lucide-react';

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getInvoiceById, updateStatus, deleteInvoice } = useInvoiceStore();
  const invoice = getInvoiceById(id);

  if (!invoice) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">发票未找到</h2>
          <p className="text-muted-foreground">该发票可能已被删除</p>
          <Button asChild className="mt-4">
            <Link href="/invoices">返回列表</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('确定要删除这张发票吗？此操作不可撤销。')) {
      deleteInvoice(invoice.id);
      router.push('/invoices');
    }
  };

  const handleMarkPaid = () => {
    updateStatus(invoice.id, 'paid');
  };

  const handleCancel = () => {
    if (confirm('确定要取消这张发票吗？')) {
      updateStatus(invoice.id, 'cancelled');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/invoices"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回发票列表
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {invoice.invoiceNumber}
              </h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="text-muted-foreground">
              创建于 {formatDate(invoice.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button onClick={handleMarkPaid}>
                <CheckCircle className="mr-2 h-4 w-4" />
                标记已付款
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/invoices/${invoice.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                编辑
              </Link>
            </Button>
            {invoice.status !== 'cancelled' && (
              <Button variant="outline" onClick={handleCancel}>
                <XCircle className="mr-2 h-4 w-4" />
                取消
              </Button>
            )}
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              打印
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <Card className="p-8 print:border-0 print:shadow-none">
        {/* Header */}
        <div className="mb-8 flex justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">Meta Inc.</h2>
            <p className="text-sm text-muted-foreground">内部发票管理系统</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
            <p className="text-sm text-muted-foreground">
              开票日期: {formatDate(invoice.issueDate)}
            </p>
            <p className="text-sm text-muted-foreground">
              到期日期: {formatDate(invoice.dueDate)}
            </p>
            {invoice.paidDate && (
              <p className="text-sm text-green-600">
                付款日期: {formatDate(invoice.paidDate)}
              </p>
            )}
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-8 rounded-lg bg-muted p-4">
          <p className="text-sm font-medium text-muted-foreground">客户信息</p>
          <p className="mt-1 font-semibold">{invoice.client.name}</p>
          <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
          {invoice.client.address && (
            <p className="text-sm text-muted-foreground">
              {invoice.client.address}
            </p>
          )}
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                <th className="pb-3">描述</th>
                <th className="pb-3 text-right">数量</th>
                <th className="pb-3 text-right">单价</th>
                <th className="pb-3 text-right">小计</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">小计</span>
              <span className="tabular-nums">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                税额 ({(invoice.taxRate * 100).toFixed(0)}%)
              </span>
              <span className="tabular-nums">
                {formatCurrency(invoice.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>总计</span>
              <span className="tabular-nums">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium text-muted-foreground">备注</p>
            <p className="mt-1 text-sm">{invoice.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

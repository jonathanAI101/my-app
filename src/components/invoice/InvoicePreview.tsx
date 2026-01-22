'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { useI18n } from '@/i18n';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Invoice } from '@/types/invoice';
import { Eye, Printer, Download } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: Invoice;
  trigger?: React.ReactNode;
}

export function InvoicePreview({ invoice, trigger }: InvoicePreviewProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              color: #1a1a1a;
            }
            .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
            .company { font-size: 20px; font-weight: bold; color: #2563eb; }
            .company-sub { font-size: 12px; color: #666; }
            .invoice-number { font-size: 24px; font-weight: bold; text-align: right; }
            .date-info { font-size: 12px; color: #666; text-align: right; margin-top: 4px; }
            .client-box { background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
            .client-label { font-size: 12px; color: #666; margin-bottom: 4px; }
            .client-name { font-weight: 600; }
            .client-email { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th { text-align: left; padding: 12px 0; border-bottom: 2px solid #e5e5e5; font-size: 12px; color: #666; }
            th.right { text-align: right; }
            td { padding: 12px 0; border-bottom: 1px solid #e5e5e5; }
            td.right { text-align: right; font-variant-numeric: tabular-nums; }
            .summary { display: flex; justify-content: flex-end; }
            .summary-box { width: 240px; }
            .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
            .summary-label { color: #666; }
            .summary-total { border-top: 2px solid #1a1a1a; padding-top: 8px; font-size: 18px; font-weight: bold; }
            .notes { background: #f5f5f5; padding: 16px; border-radius: 8px; margin-top: 24px; }
            .notes-label { font-size: 12px; color: #666; margin-bottom: 4px; }
            .status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 500;
              margin-left: 12px;
            }
            .status-paid { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-overdue { background: #fee2e2; color: #991b1b; }
            .status-draft { background: #f3f4f6; color: #374151; }
            .status-cancelled { background: #f3f4f6; color: #6b7280; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">${t.detail.companyName}</div>
              <div class="company-sub">${t.detail.companySubtitle}</div>
            </div>
            <div>
              <div class="invoice-number">${invoice.invoiceNumber}</div>
              <div class="date-info">${t.invoices.issueDate}: ${formatDate(invoice.issueDate)}</div>
              <div class="date-info">${t.invoices.dueDate}: ${formatDate(invoice.dueDate)}</div>
              ${invoice.paidDate ? `<div class="date-info" style="color: #166534;">${t.invoices.paidDate}: ${formatDate(invoice.paidDate)}</div>` : ''}
            </div>
          </div>

          <div class="client-box">
            <div class="client-label">${t.form.clientInfo}</div>
            <div class="client-name">${invoice.client.name}</div>
            <div class="client-email">${invoice.client.email}</div>
            ${invoice.client.address ? `<div class="client-email">${invoice.client.address}</div>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>${t.form.description}</th>
                <th class="right">${t.form.quantity}</th>
                <th class="right">${t.form.unitPrice}</th>
                <th class="right">${t.form.subtotalItem}</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="right">${item.quantity}</td>
                  <td class="right">${formatCurrency(item.unitPrice)}</td>
                  <td class="right">${formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-box">
              <div class="summary-row">
                <span class="summary-label">${t.form.subtotal}</span>
                <span>${formatCurrency(invoice.subtotal)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">${t.form.taxAmount} (${(invoice.taxRate * 100).toFixed(0)}%)</span>
                <span>${formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div class="summary-row summary-total">
                <span>${t.form.total}</span>
                <span>${formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          ${invoice.notes ? `
            <div class="notes">
              <div class="notes-label">${t.form.notes}</div>
              <div>${invoice.notes}</div>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
            <span className="sr-only">{t.preview?.title || '预览'}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {invoice.invoiceNumber}
            <InvoiceStatusBadge status={invoice.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Header */}
          <div className="mb-6 flex justify-between">
            <div>
              <h2 className="text-lg font-bold text-primary">{t.detail.companyName}</h2>
              <p className="text-sm text-muted-foreground">{t.detail.companySubtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {t.invoices.issueDate}: {formatDate(invoice.issueDate)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.invoices.dueDate}: {formatDate(invoice.dueDate)}
              </p>
              {invoice.paidDate && (
                <p className="text-sm text-green-600">
                  {t.invoices.paidDate}: {formatDate(invoice.paidDate)}
                </p>
              )}
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-6 rounded-lg bg-muted p-4">
            <p className="text-xs font-medium text-muted-foreground">{t.form.clientInfo}</p>
            <p className="mt-1 font-semibold">{invoice.client.name}</p>
            <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
            {invoice.client.address && (
              <p className="text-sm text-muted-foreground">{invoice.client.address}</p>
            )}
          </div>

          {/* Line Items */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                  <th className="pb-2">{t.form.description}</th>
                  <th className="pb-2 text-right">{t.form.quantity}</th>
                  <th className="pb-2 text-right">{t.form.unitPrice}</th>
                  <th className="pb-2 text-right">{t.form.subtotalItem}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="py-2 text-right tabular-nums">{item.quantity}</td>
                    <td className="py-2 text-right tabular-nums">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-56 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.form.subtotal}</span>
                <span className="tabular-nums">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t.form.taxAmount} ({(invoice.taxRate * 100).toFixed(0)}%)
                </span>
                <span className="tabular-nums">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>{t.form.total}</span>
                <span className="tabular-nums">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="text-xs font-medium text-muted-foreground">{t.form.notes}</p>
              <p className="mt-1 text-sm">{invoice.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              {t.detail.print}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`/invoices/${invoice.id}`}>
                <Download className="mr-2 h-4 w-4" />
                {t.detail.viewDetails}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

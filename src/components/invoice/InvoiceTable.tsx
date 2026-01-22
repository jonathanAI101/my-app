'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { InvoicePreview } from './InvoicePreview';
import { useI18n } from '@/i18n';
import { useTableConfigStore, COLUMN_IDS } from '@/store/tableConfigStore';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Invoice } from '@/types/invoice';
import { MoreHorizontal, Eye, Pencil, Trash2, CheckCircle, XCircle, FileSearch } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Invoice['status']) => void;
}

export function InvoiceTable({ invoices, onDelete, onStatusChange }: InvoiceTableProps) {
  const { t } = useI18n();
  const { isColumnVisible } = useTableConfigStore();

  // 计算可见列数量（用于 colspan）
  const visibleColumnCount = [
    COLUMN_IDS.INVOICE_NUMBER,
    COLUMN_IDS.CLIENT,
    COLUMN_IDS.AMOUNT,
    COLUMN_IDS.ISSUE_DATE,
    COLUMN_IDS.DUE_DATE,
    COLUMN_IDS.STATUS,
    COLUMN_IDS.ACTIONS,
  ].filter(isColumnVisible).length;

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {isColumnVisible(COLUMN_IDS.INVOICE_NUMBER) && (
              <TableHead className="w-[140px]">{t.invoices.invoiceNumber}</TableHead>
            )}
            {isColumnVisible(COLUMN_IDS.CLIENT) && (
              <TableHead>{t.invoices.client}</TableHead>
            )}
            {isColumnVisible(COLUMN_IDS.AMOUNT) && (
              <TableHead className="text-right">{t.invoices.amount}</TableHead>
            )}
            {isColumnVisible(COLUMN_IDS.ISSUE_DATE) && (
              <TableHead>{t.invoices.issueDate}</TableHead>
            )}
            {isColumnVisible(COLUMN_IDS.DUE_DATE) && (
              <TableHead>{t.invoices.dueDate}</TableHead>
            )}
            {isColumnVisible(COLUMN_IDS.STATUS) && (
              <TableHead>{t.invoices.status}</TableHead>
            )}
            {isColumnVisible(COLUMN_IDS.ACTIONS) && (
              <TableHead className="w-[70px]">{t.common.actions}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumnCount} className="h-24 text-center text-muted-foreground">
                {t.invoices.noInvoices}
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id} className="group">
                {isColumnVisible(COLUMN_IDS.INVOICE_NUMBER) && (
                  <TableCell className="font-medium">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="text-primary hover:underline"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </TableCell>
                )}
                {isColumnVisible(COLUMN_IDS.CLIENT) && (
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.client.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.client.email}
                      </div>
                    </div>
                  </TableCell>
                )}
                {isColumnVisible(COLUMN_IDS.AMOUNT) && (
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                )}
                {isColumnVisible(COLUMN_IDS.ISSUE_DATE) && (
                  <TableCell className="text-muted-foreground">
                    {formatDate(invoice.issueDate)}
                  </TableCell>
                )}
                {isColumnVisible(COLUMN_IDS.DUE_DATE) && (
                  <TableCell className="text-muted-foreground">
                    {formatDate(invoice.dueDate)}
                  </TableCell>
                )}
                {isColumnVisible(COLUMN_IDS.STATUS) && (
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                )}
                {isColumnVisible(COLUMN_IDS.ACTIONS) && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {/* 快捷预览按钮 */}
                      <InvoicePreview
                        invoice={invoice}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">{t.preview?.title || '预览'}</span>
                          </Button>
                        }
                      />
                      {/* 更多操作 */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t.common.actions}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/invoices/${invoice.id}`}>
                              <FileSearch className="mr-2 h-4 w-4" />
                              {t.detail.viewDetails}
                            </Link>
                          </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/invoices/${invoice.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t.common.edit}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <DropdownMenuItem
                            onClick={() => onStatusChange?.(invoice.id, 'paid')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            {t.detail.markPaid}
                          </DropdownMenuItem>
                        )}
                        {invoice.status !== 'cancelled' && (
                          <DropdownMenuItem
                            onClick={() => onStatusChange?.(invoice.id, 'cancelled')}
                          >
                            <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                            {t.detail.cancelInvoice}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete?.(invoice.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t.common.delete}
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

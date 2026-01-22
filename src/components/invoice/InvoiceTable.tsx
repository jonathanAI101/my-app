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
import { formatCurrency, formatDate } from '@/utils/format';
import type { Invoice } from '@/types/invoice';
import { MoreHorizontal, Eye, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Invoice['status']) => void;
}

export function InvoiceTable({ invoices, onDelete, onStatusChange }: InvoiceTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[140px]">发票号</TableHead>
            <TableHead>客户</TableHead>
            <TableHead className="text-right">金额</TableHead>
            <TableHead>开票日期</TableHead>
            <TableHead>到期日期</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="w-[70px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                暂无发票数据
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id} className="group">
                <TableCell className="font-medium">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="text-primary hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{invoice.client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {invoice.client.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(invoice.total)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(invoice.issueDate)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(invoice.dueDate)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">操作菜单</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/invoices/${invoice.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看详情
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/invoices/${invoice.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange?.(invoice.id, 'paid')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          标记为已付款
                        </DropdownMenuItem>
                      )}
                      {invoice.status !== 'cancelled' && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange?.(invoice.id, 'cancelled')}
                        >
                          <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                          取消发票
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete?.(invoice.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

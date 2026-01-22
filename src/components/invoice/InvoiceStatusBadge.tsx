'use client';

import { Badge } from '@/components/ui/badge';
import type { InvoiceStatus } from '@/types/invoice';

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: {
    label: '草稿',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  },
  pending: {
    label: '待付款',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  paid: {
    label: '已付款',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  overdue: {
    label: '已逾期',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },
  cancelled: {
    label: '已取消',
    className: 'bg-gray-100 text-gray-500 hover:bg-gray-100 line-through',
  },
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}

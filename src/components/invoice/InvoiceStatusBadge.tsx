'use client';

import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/i18n';
import type { InvoiceStatus } from '@/types/invoice';

const statusStyles: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  pending: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  paid: 'bg-green-100 text-green-700 hover:bg-green-100',
  overdue: 'bg-red-100 text-red-700 hover:bg-red-100',
  cancelled: 'bg-gray-100 text-gray-500 hover:bg-gray-100 line-through',
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const { t } = useI18n();

  const statusLabels: Record<InvoiceStatus, string> = {
    draft: t.status.draft,
    pending: t.status.pending,
    paid: t.status.paid,
    overdue: t.status.overdue,
    cancelled: t.status.cancelled,
  };

  return (
    <Badge variant="secondary" className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  );
}

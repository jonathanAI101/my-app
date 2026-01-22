'use client';

import { useTableConfigStore } from '@/store/tableConfigStore';
import { useI18n } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings2, RotateCcw } from 'lucide-react';

// 列 ID 到翻译键的映射
const columnLabelKeys: Record<string, keyof typeof import('@/i18n/locales').locales.zh.invoices> = {
  invoiceNumber: 'invoiceNumber',
  client: 'client',
  amount: 'amount',
  issueDate: 'issueDate',
  dueDate: 'dueDate',
  status: 'status',
};

export function ColumnToggle() {
  const { columns, toggleColumnVisibility, resetToDefaults } = useTableConfigStore();
  const { t } = useI18n();

  // 获取可隐藏的列
  const hidableColumns = columns.filter((col) => col.canHide);

  const getColumnLabel = (columnId: string): string => {
    const key = columnLabelKeys[columnId];
    if (key && t.invoices[key]) {
      return t.invoices[key] as string;
    }
    return columnId;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Settings2 className="mr-2 h-4 w-4" />
          {t.common.filter}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t.invoices.columns || '显示列'}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {hidableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.visible}
            onCheckedChange={() => toggleColumnVisibility(column.id)}
          >
            {getColumnLabel(column.id)}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start px-2"
          onClick={resetToDefaults}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {t.common.reset}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

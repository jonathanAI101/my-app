'use client';

import { useRef } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useI18n } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  exportToCSV,
  exportToJSON,
  exportToReport,
  importFromJSON,
  downloadFile,
  generateFilename,
} from '@/lib/dataExport';
import { Download, Upload, FileSpreadsheet, FileJson, FileText } from 'lucide-react';

export function DataExportButton() {
  const { invoices, addInvoice } = useInvoiceStore();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    const content = exportToCSV(invoices);
    downloadFile(content, generateFilename('invoices', 'csv'), 'text/csv;charset=utf-8');
  };

  const handleExportJSON = () => {
    const content = exportToJSON(invoices);
    downloadFile(content, generateFilename('invoices', 'json'), 'application/json');
  };

  const handleExportReport = () => {
    const content = exportToReport(invoices);
    downloadFile(content, generateFilename('invoice_report', 'txt'), 'text/plain;charset=utf-8');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importFromJSON(content);

      if (result.success && result.invoices) {
        // 导入发票（避免重复）
        const existingIds = new Set(invoices.map((inv) => inv.id));
        let importedCount = 0;
        let skippedCount = 0;

        result.invoices.forEach((invoice) => {
          if (!existingIds.has(invoice.id)) {
            // 为导入的发票创建新 ID
            addInvoice({
              client: invoice.client,
              items: invoice.items,
              taxRate: invoice.taxRate,
              issueDate: invoice.issueDate,
              dueDate: invoice.dueDate,
              status: invoice.status,
              notes: invoice.notes,
            });
            importedCount++;
          } else {
            skippedCount++;
          }
        });

        alert(
          `${t.export?.importSuccess || '导入成功'}: ${importedCount} ${t.export?.invoicesImported || '条发票已导入'}${skippedCount > 0 ? `\n${skippedCount} ${t.export?.skipped || '条重复数据已跳过'}` : ''}`
        );
      } else {
        alert(`${t.export?.importError || '导入失败'}: ${result.error}`);
      }

      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            {t.export?.title || '导出'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>{t.export?.exportAs || '导出为'}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            CSV ({t.export?.excel || 'Excel'})
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleExportJSON}>
            <FileJson className="mr-2 h-4 w-4" />
            JSON
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleExportReport}>
            <FileText className="mr-2 h-4 w-4" />
            {t.export?.report || '文本报表'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleImportClick}>
            <Upload className="mr-2 h-4 w-4" />
            {t.export?.importJSON || '导入 JSON'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

import type { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/utils/format';

/**
 * 导出发票数据为 CSV 格式
 */
export function exportToCSV(invoices: Invoice[]): string {
  const headers = [
    '发票号',
    '客户名称',
    '客户邮箱',
    '金额',
    '小计',
    '税额',
    '税率',
    '开票日期',
    '到期日期',
    '付款日期',
    '状态',
    '备注',
  ];

  const rows = invoices.map((invoice) => [
    invoice.invoiceNumber,
    invoice.client.name,
    invoice.client.email,
    (invoice.total / 100).toFixed(2),
    (invoice.subtotal / 100).toFixed(2),
    (invoice.taxAmount / 100).toFixed(2),
    `${(invoice.taxRate * 100).toFixed(0)}%`,
    invoice.issueDate,
    invoice.dueDate,
    invoice.paidDate || '',
    invoice.status,
    invoice.notes || '',
  ]);

  // CSV 编码（处理特殊字符）
  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  // 添加 BOM 以支持 Excel 打开中文
  return '\uFEFF' + csvContent;
}

/**
 * 导出发票数据为 JSON 格式
 */
export function exportToJSON(invoices: Invoice[]): string {
  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    invoiceCount: invoices.length,
    invoices: invoices,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * 导出发票数据为格式化的文本报表
 */
export function exportToReport(invoices: Invoice[]): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('发票数据报表');
  lines.push(`导出时间: ${new Date().toLocaleString('zh-CN')}`);
  lines.push(`发票数量: ${invoices.length}`);
  lines.push('='.repeat(60));
  lines.push('');

  invoices.forEach((invoice, index) => {
    lines.push(`[${index + 1}] ${invoice.invoiceNumber}`);
    lines.push(`    客户: ${invoice.client.name} (${invoice.client.email})`);
    lines.push(`    金额: ${formatCurrency(invoice.total)}`);
    lines.push(`    日期: ${formatDate(invoice.issueDate)} - ${formatDate(invoice.dueDate)}`);
    lines.push(`    状态: ${invoice.status}`);
    lines.push('');
  });

  // 统计信息
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  lines.push('-'.repeat(60));
  lines.push('统计摘要');
  lines.push(`    总金额: ${formatCurrency(totalAmount)}`);
  lines.push(`    已付款: ${formatCurrency(paidAmount)}`);
  lines.push(`    待付款: ${formatCurrency(pendingAmount)}`);
  lines.push('-'.repeat(60));

  return lines.join('\n');
}

/**
 * 从 JSON 导入发票数据（带验证）
 */
export function importFromJSON(jsonString: string): {
  success: boolean;
  invoices?: Invoice[];
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);

    // 检查数据格式
    if (!data.invoices || !Array.isArray(data.invoices)) {
      return { success: false, error: '无效的数据格式：缺少 invoices 数组' };
    }

    // 验证每条发票数据
    const validatedInvoices: Invoice[] = [];
    const errors: string[] = [];

    data.invoices.forEach((invoice: unknown, index: number) => {
      const result = validateInvoice(invoice);
      if (result.valid) {
        validatedInvoices.push(result.invoice!);
      } else {
        errors.push(`发票 ${index + 1}: ${result.error}`);
      }
    });

    if (errors.length > 0) {
      return {
        success: false,
        error: `验证失败:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n...还有 ${errors.length - 5} 个错误` : ''}`,
      };
    }

    return { success: true, invoices: validatedInvoices };
  } catch {
    return { success: false, error: '无效的 JSON 格式' };
  }
}

/**
 * 验证单条发票数据
 */
function validateInvoice(data: unknown): {
  valid: boolean;
  invoice?: Invoice;
  error?: string;
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: '无效的数据对象' };
  }

  const invoice = data as Record<string, unknown>;

  // 必填字段验证
  const requiredFields = [
    'id',
    'invoiceNumber',
    'client',
    'items',
    'subtotal',
    'taxRate',
    'taxAmount',
    'total',
    'issueDate',
    'dueDate',
    'status',
    'createdAt',
    'updatedAt',
  ];

  for (const field of requiredFields) {
    if (invoice[field] === undefined) {
      return { valid: false, error: `缺少必填字段: ${field}` };
    }
  }

  // 验证 client
  const client = invoice.client as Record<string, unknown>;
  if (!client.name || !client.email) {
    return { valid: false, error: '客户信息不完整' };
  }

  // 验证状态
  const validStatuses = ['draft', 'pending', 'paid', 'overdue', 'cancelled'];
  if (!validStatuses.includes(invoice.status as string)) {
    return { valid: false, error: `无效的状态: ${invoice.status}` };
  }

  return { valid: true, invoice: data as Invoice };
}

/**
 * 下载文件
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 生成带时间戳的文件名
 */
export function generateFilename(baseName: string, extension: string): string {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `${baseName}_${timestamp}.${extension}`;
}

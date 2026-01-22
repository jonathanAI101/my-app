'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/format';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { LineItem, InvoiceStatus } from '@/types/invoice';

const taxRateOptions = [
  { value: '0', label: '0%' },
  { value: '0.06', label: '6%' },
  { value: '0.13', label: '13%' },
];

export default function NewInvoicePage() {
  const router = useRouter();
  const { addInvoice } = useInvoiceStore();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [taxRate, setTaxRate] = useState('0.06');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = Math.round(subtotal * parseFloat(taxRate));
  const total = subtotal + taxAmount;

  const handleSubmit = (status: InvoiceStatus) => {
    if (!clientName || !clientEmail) {
      alert('请填写客户名称和邮箱');
      return;
    }

    if (items.some((item) => !item.description || item.unitPrice <= 0)) {
      alert('请完善明细项信息');
      return;
    }

    addInvoice({
      client: {
        name: clientName,
        email: clientEmail,
        address: clientAddress || undefined,
      },
      items,
      taxRate: parseFloat(taxRate),
      issueDate: new Date(issueDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      status,
      notes: notes || undefined,
    });

    router.push('/invoices');
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
        <h1 className="text-2xl font-bold tracking-tight">新建发票</h1>
        <p className="text-muted-foreground">创建新的发票记录</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Client Info */}
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">客户信息</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">客户名称 *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="公司或个人名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">邮箱 *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="finance@example.com"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientAddress">地址</Label>
                <Input
                  id="clientAddress"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="详细地址（选填）"
                />
              </div>
            </div>
          </Card>

          {/* Invoice Info */}
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">发票信息</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="issueDate">开票日期</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">到期日期</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Line Items */}
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">明细项</h2>
            <div className="space-y-4">
              {/* Header */}
              <div className="hidden grid-cols-12 gap-4 text-sm font-medium text-muted-foreground sm:grid">
                <div className="col-span-5">描述</div>
                <div className="col-span-2">数量</div>
                <div className="col-span-2">单价（元）</div>
                <div className="col-span-2 text-right">小计</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-5">
                    <Input
                      placeholder="服务描述"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, 'description', e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice / 100}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'unitPrice',
                          Math.round(parseFloat(e.target.value) * 100) || 0
                        )
                      }
                    />
                  </div>
                  <div className="col-span-3 flex items-center justify-end text-sm font-medium sm:col-span-2">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                添加明细
              </Button>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">备注</h2>
            <Textarea
              placeholder="添加备注信息（选填）"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 p-6">
            <h2 className="mb-4 font-semibold">金额汇总</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">小计</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">税率</span>
                <Select value={taxRate} onValueChange={setTaxRate}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taxRateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">税额</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>总计</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Button
                className="w-full"
                onClick={() => handleSubmit('pending')}
              >
                创建发票
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSubmit('draft')}
              >
                保存草稿
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

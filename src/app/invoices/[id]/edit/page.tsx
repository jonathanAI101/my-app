'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useI18n } from '@/i18n';
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
import type { LineItem } from '@/types/invoice';

const taxRateOptions = [
  { value: '0', label: '0%' },
  { value: '0.06', label: '6%' },
  { value: '0.13', label: '13%' },
];

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getInvoiceById, updateInvoice } = useInvoiceStore();
  const { t } = useI18n();
  const invoice = getInvoiceById(id);

  const [clientName, setClientName] = useState(invoice?.client.name || '');
  const [clientEmail, setClientEmail] = useState(invoice?.client.email || '');
  const [clientAddress, setClientAddress] = useState(invoice?.client.address || '');
  const [issueDate, setIssueDate] = useState(
    invoice?.issueDate.split('T')[0] || ''
  );
  const [dueDate, setDueDate] = useState(invoice?.dueDate.split('T')[0] || '');
  const [taxRate, setTaxRate] = useState(String(invoice?.taxRate || 0.06));
  const [notes, setNotes] = useState(invoice?.notes || '');
  const [items, setItems] = useState<LineItem[]>(invoice?.items || []);

  if (!invoice) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">{t.detail.notFound}</h2>
          <p className="text-muted-foreground">{t.detail.notFoundMessage}</p>
          <Button asChild className="mt-4">
            <Link href="/invoices">{t.detail.backToList}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const addItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (itemId: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const updateItem = (itemId: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = Math.round(subtotal * parseFloat(taxRate));
  const total = subtotal + taxAmount;

  const handleSubmit = () => {
    if (!clientName || !clientEmail) {
      alert(t.form.fillClientInfo);
      return;
    }

    if (items.some((item) => !item.description || item.unitPrice <= 0)) {
      alert(t.form.fillItemInfo);
      return;
    }

    updateInvoice(invoice.id, {
      client: {
        name: clientName,
        email: clientEmail,
        address: clientAddress || undefined,
      },
      items,
      taxRate: parseFloat(taxRate),
      issueDate: new Date(issueDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      notes: notes || undefined,
    });

    router.push(`/invoices/${invoice.id}`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/invoices/${invoice.id}`}
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t.form.backToDetail}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {t.form.editTitle} {invoice.invoiceNumber}
        </h1>
        <p className="text-muted-foreground">{t.form.editSubtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Client Info */}
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">{t.form.clientInfo}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">{t.form.clientName} *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={t.form.clientNamePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">{t.form.email} *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder={t.form.emailPlaceholder}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientAddress">{t.form.address}</Label>
                <Input
                  id="clientAddress"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder={t.form.addressPlaceholder}
                />
              </div>
            </div>
          </Card>

          {/* Invoice Info */}
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">{t.form.invoiceInfo}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="issueDate">{t.invoices.issueDate}</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">{t.invoices.dueDate}</Label>
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
            <h2 className="mb-4 font-semibold">{t.form.lineItems}</h2>
            <div className="space-y-4">
              {/* Header */}
              <div className="hidden grid-cols-12 gap-4 text-sm font-medium text-muted-foreground sm:grid">
                <div className="col-span-5">{t.form.description}</div>
                <div className="col-span-2">{t.form.quantity}</div>
                <div className="col-span-2">{t.form.unitPrice}</div>
                <div className="col-span-2 text-right">{t.form.subtotalItem}</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-5">
                    <Input
                      placeholder={t.form.descriptionPlaceholder}
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
                {t.form.addItem}
              </Button>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">{t.form.notes}</h2>
            <Textarea
              placeholder={t.form.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 p-6">
            <h2 className="mb-4 font-semibold">{t.form.summary}</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.form.subtotal}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{t.form.taxRate}</span>
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
                <span className="text-muted-foreground">{t.form.taxAmount}</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t.form.total}</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Button className="w-full" onClick={handleSubmit}>
                {t.form.saveChanges}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/invoices/${invoice.id}`}>{t.common.cancel}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

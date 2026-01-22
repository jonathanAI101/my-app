import type { Invoice, InvoiceStatus } from '@/types/invoice';

const clients = [
  { name: '阿里巴巴集团', email: 'finance@alibaba.com', address: '杭州市余杭区文一西路969号' },
  { name: '腾讯科技', email: 'ap@tencent.com', address: '深圳市南山区科技园' },
  { name: '字节跳动', email: 'billing@bytedance.com', address: '北京市海淀区中航广场' },
  { name: '美团点评', email: 'finance@meituan.com', address: '北京市朝阳区望京东路6号' },
  { name: '京东集团', email: 'vendor@jd.com', address: '北京市亦庄经济开发区' },
  { name: '网易公司', email: 'payment@netease.com', address: '杭州市滨江区网商路599号' },
  { name: '小米科技', email: 'ap@xiaomi.com', address: '北京市海淀区清河中街68号' },
  { name: '华为技术', email: 'finance@huawei.com', address: '深圳市龙岗区坂田华为基地' },
  { name: '百度在线', email: 'billing@baidu.com', address: '北京市海淀区上地十街10号' },
  { name: '滴滴出行', email: 'vendor@didiglobal.com', address: '北京市海淀区东北旺西路8号' },
];

const services = [
  { description: '软件开发服务', unitPrice: 150000 },
  { description: 'UI/UX 设计服务', unitPrice: 80000 },
  { description: '技术咨询服务', unitPrice: 50000 },
  { description: '系统维护服务', unitPrice: 30000 },
  { description: '数据分析服务', unitPrice: 100000 },
  { description: '云服务托管费', unitPrice: 25000 },
  { description: 'API 接口调用费', unitPrice: 15000 },
  { description: '培训服务费', unitPrice: 20000 },
  { description: '项目管理服务', unitPrice: 45000 },
  { description: '安全审计服务', unitPrice: 60000 },
];

const statuses: InvoiceStatus[] = ['draft', 'pending', 'paid', 'overdue', 'cancelled'];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMockInvoices(count: number): Invoice[] {
  const invoices: Invoice[] = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  for (let i = 0; i < count; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const issueDate = randomDate(threeMonthsAgo, now);
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);

    // 随机选择 1-4 个服务项目
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const selectedServices = [...services]
      .sort(() => Math.random() - 0.5)
      .slice(0, itemCount);

    const items = selectedServices.map((service, index) => ({
      id: `item-${i}-${index}`,
      description: service.description,
      quantity: Math.floor(Math.random() * 5) + 1,
      unitPrice: service.unitPrice,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxRate = [0, 0.06, 0.13][Math.floor(Math.random() * 3)];
    const taxAmount = Math.round(subtotal * taxRate);
    const total = subtotal + taxAmount;

    // 根据日期和随机因素确定状态
    let status: InvoiceStatus;
    const random = Math.random();
    if (dueDate < now && random < 0.3) {
      status = 'overdue';
    } else if (random < 0.1) {
      status = 'draft';
    } else if (random < 0.2) {
      status = 'cancelled';
    } else if (random < 0.5) {
      status = 'pending';
    } else {
      status = 'paid';
    }

    const paidDate = status === 'paid'
      ? new Date(issueDate.getTime() + Math.random() * (dueDate.getTime() - issueDate.getTime())).toISOString()
      : undefined;

    invoices.push({
      id: `inv-${String(i + 1).padStart(3, '0')}`,
      invoiceNumber: `INV-2024-${String(i + 1).padStart(4, '0')}`,
      client,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      paidDate,
      status,
      notes: Math.random() > 0.7 ? '请于到期日前完成付款，谢谢合作！' : undefined,
      createdAt: issueDate.toISOString(),
      updatedAt: issueDate.toISOString(),
    });
  }

  // 按创建日期倒序排列
  return invoices.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const mockInvoices = generateMockInvoices(50);

export function getInvoiceStats() {
  const stats = {
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    invoiceCount: mockInvoices.length,
    paidCount: 0,
    overdueCount: 0,
  };

  mockInvoices.forEach((invoice) => {
    if (invoice.status === 'paid') {
      stats.totalRevenue += invoice.total;
      stats.paidCount++;
    } else if (invoice.status === 'pending') {
      stats.pendingAmount += invoice.total;
    } else if (invoice.status === 'overdue') {
      stats.overdueAmount += invoice.total;
      stats.overdueCount++;
    }
  });

  return stats;
}

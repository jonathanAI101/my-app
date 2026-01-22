export const locales = {
  zh: {
    // Common
    common: {
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      view: '查看',
      search: '搜索',
      filter: '筛选',
      actions: '操作',
      back: '返回',
      loading: '加载中...',
      noData: '暂无数据',
      confirm: '确认',
      all: '全部',
      reset: '重置',
    },

    // Navigation
    nav: {
      dashboard: '仪表盘',
      invoices: '发票管理',
      newInvoice: '新建发票',
      settings: '设置',
    },

    // Dashboard
    dashboard: {
      title: '仪表盘',
      welcome: '欢迎回来，这是您的发票概览',
      totalRevenue: '总收入',
      pendingAmount: '待收款',
      overdueAmount: '逾期款项',
      totalInvoices: '发票总数',
      paidCount: '{count} 张已付款',
      overdueCount: '{count} 张已逾期',
      waitingPayment: '等待客户付款',
      allInvoices: '所有发票',
      recentInvoices: '最近发票',
      viewAll: '查看全部',
      overdueAlert: '逾期提醒',
      overdueMessage: '您有 {count} 张发票已逾期，总金额 {amount}',
      handleNow: '立即处理',
    },

    // Invoices
    invoices: {
      title: '发票管理',
      subtitle: '管理和跟踪您的所有发票',
      newInvoice: '新建发票',
      searchPlaceholder: '搜索发票号或客户名...',
      invoiceNumber: '发票号',
      client: '客户',
      amount: '金额',
      issueDate: '开票日期',
      dueDate: '到期日期',
      paidDate: '付款日期',
      status: '状态',
      noInvoices: '暂无发票数据',
      pagination: '共 {total} 条，第 {current}/{pages} 页',
      prevPage: '上一页',
      nextPage: '下一页',
      date: '日期',
      perPage: '条/页',
      columns: '显示列',
    },

    // Invoice Status
    status: {
      all: '全部状态',
      draft: '草稿',
      pending: '待付款',
      paid: '已付款',
      overdue: '已逾期',
      cancelled: '已取消',
    },

    // Invoice Form
    form: {
      createTitle: '新建发票',
      createSubtitle: '创建新的发票记录',
      editTitle: '编辑发票',
      editSubtitle: '修改发票信息',
      backToList: '返回发票列表',
      backToDetail: '返回发票详情',

      clientInfo: '客户信息',
      clientName: '客户名称',
      clientNamePlaceholder: '公司或个人名称',
      email: '邮箱',
      emailPlaceholder: 'finance@example.com',
      address: '地址',
      addressPlaceholder: '详细地址（选填）',

      invoiceInfo: '发票信息',

      lineItems: '明细项',
      description: '描述',
      descriptionPlaceholder: '服务描述',
      quantity: '数量',
      unitPrice: '单价（元）',
      subtotalItem: '小计',
      addItem: '添加明细',

      notes: '备注',
      notesPlaceholder: '添加备注信息（选填）',

      summary: '金额汇总',
      subtotal: '小计',
      taxRate: '税率',
      taxAmount: '税额',
      total: '总计',

      createInvoice: '创建发票',
      saveDraft: '保存草稿',
      saveChanges: '保存修改',

      required: '必填',
      fillClientInfo: '请填写客户名称和邮箱',
      fillItemInfo: '请完善明细项信息',
    },

    // Invoice Detail
    detail: {
      createdAt: '创建于',
      markPaid: '标记已付款',
      print: '打印',
      cancelInvoice: '取消',
      deleteInvoice: '删除',
      viewDetails: '查看详情',

      notFound: '发票未找到',
      notFoundMessage: '该发票可能已被删除',
      backToList: '返回列表',

      confirmDelete: '确定要删除这张发票吗？此操作不可撤销。',
      confirmCancel: '确定要取消这张发票吗？',

      companyName: 'Meta Inc.',
      companySubtitle: '内部发票管理系统',
    },

    // Footer
    footer: {
      copyright: '© {year} Meta Inc. 保留所有权利',
      internalTool: '内部工具',
    },

    // Export
    export: {
      title: '导出',
      exportAs: '导出为',
      excel: 'Excel',
      report: '文本报表',
      importJSON: '导入 JSON',
      importSuccess: '导入成功',
      invoicesImported: '条发票已导入',
      skipped: '条重复数据已跳过',
      importError: '导入失败',
    },

    // Preview
    preview: {
      title: '预览',
      quickPreview: '快速预览',
    },

    // Language
    language: {
      zh: '中文',
      en: 'English',
      switchLanguage: '切换语言',
    },
  },

  en: {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      actions: 'Actions',
      back: 'Back',
      loading: 'Loading...',
      noData: 'No data',
      confirm: 'Confirm',
      all: 'All',
      reset: 'Reset',
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      invoices: 'Invoices',
      newInvoice: 'New Invoice',
      settings: 'Settings',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back, here is your invoice overview',
      totalRevenue: 'Total Revenue',
      pendingAmount: 'Pending',
      overdueAmount: 'Overdue',
      totalInvoices: 'Total Invoices',
      paidCount: '{count} paid',
      overdueCount: '{count} overdue',
      waitingPayment: 'Waiting for payment',
      allInvoices: 'All invoices',
      recentInvoices: 'Recent Invoices',
      viewAll: 'View All',
      overdueAlert: 'Overdue Alert',
      overdueMessage: 'You have {count} overdue invoices, total {amount}',
      handleNow: 'Handle Now',
    },

    // Invoices
    invoices: {
      title: 'Invoice Management',
      subtitle: 'Manage and track all your invoices',
      newInvoice: 'New Invoice',
      searchPlaceholder: 'Search invoice number or client...',
      invoiceNumber: 'Invoice #',
      client: 'Client',
      amount: 'Amount',
      issueDate: 'Issue Date',
      dueDate: 'Due Date',
      paidDate: 'Paid Date',
      status: 'Status',
      noInvoices: 'No invoices found',
      pagination: 'Total {total}, Page {current}/{pages}',
      prevPage: 'Previous',
      nextPage: 'Next',
      date: 'Date',
      perPage: 'per page',
      columns: 'Columns',
    },

    // Invoice Status
    status: {
      all: 'All Status',
      draft: 'Draft',
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled',
    },

    // Invoice Form
    form: {
      createTitle: 'New Invoice',
      createSubtitle: 'Create a new invoice record',
      editTitle: 'Edit Invoice',
      editSubtitle: 'Modify invoice information',
      backToList: 'Back to invoice list',
      backToDetail: 'Back to invoice detail',

      clientInfo: 'Client Information',
      clientName: 'Client Name',
      clientNamePlaceholder: 'Company or individual name',
      email: 'Email',
      emailPlaceholder: 'finance@example.com',
      address: 'Address',
      addressPlaceholder: 'Detailed address (optional)',

      invoiceInfo: 'Invoice Information',

      lineItems: 'Line Items',
      description: 'Description',
      descriptionPlaceholder: 'Service description',
      quantity: 'Qty',
      unitPrice: 'Unit Price',
      subtotalItem: 'Subtotal',
      addItem: 'Add Item',

      notes: 'Notes',
      notesPlaceholder: 'Add notes (optional)',

      summary: 'Summary',
      subtotal: 'Subtotal',
      taxRate: 'Tax Rate',
      taxAmount: 'Tax',
      total: 'Total',

      createInvoice: 'Create Invoice',
      saveDraft: 'Save as Draft',
      saveChanges: 'Save Changes',

      required: 'Required',
      fillClientInfo: 'Please fill in client name and email',
      fillItemInfo: 'Please complete line item information',
    },

    // Invoice Detail
    detail: {
      createdAt: 'Created on',
      markPaid: 'Mark as Paid',
      print: 'Print',
      cancelInvoice: 'Cancel',
      deleteInvoice: 'Delete',
      viewDetails: 'View Details',

      notFound: 'Invoice Not Found',
      notFoundMessage: 'This invoice may have been deleted',
      backToList: 'Back to List',

      confirmDelete: 'Are you sure you want to delete this invoice? This action cannot be undone.',
      confirmCancel: 'Are you sure you want to cancel this invoice?',

      companyName: 'Meta Inc.',
      companySubtitle: 'Internal Invoice System',
    },

    // Footer
    footer: {
      copyright: '© {year} Meta Inc. All rights reserved',
      internalTool: 'Internal Tool',
    },

    // Export
    export: {
      title: 'Export',
      exportAs: 'Export as',
      excel: 'Excel',
      report: 'Text Report',
      importJSON: 'Import JSON',
      importSuccess: 'Import successful',
      invoicesImported: 'invoices imported',
      skipped: 'duplicates skipped',
      importError: 'Import failed',
    },

    // Preview
    preview: {
      title: 'Preview',
      quickPreview: 'Quick Preview',
    },

    // Language
    language: {
      zh: '中文',
      en: 'English',
      switchLanguage: 'Switch Language',
    },
  },
} as const;

export type Locale = keyof typeof locales;
export type Translations = (typeof locales)[Locale];

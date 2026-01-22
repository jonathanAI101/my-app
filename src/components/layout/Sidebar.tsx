'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Globe,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();

  const navigation = [
    { name: t.nav.dashboard, href: '/', icon: LayoutDashboard },
    { name: t.nav.invoices, href: '/invoices', icon: FileText },
    { name: t.nav.newInvoice, href: '/invoices/new', icon: PlusCircle },
  ];

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold">
          {locale === 'zh' ? '发票管理' : 'Invoices'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t p-4">
        {/* Language Switcher */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLocale}
          className="mb-3 w-full justify-start gap-2 text-muted-foreground"
        >
          <Globe className="h-4 w-4" />
          {locale === 'zh' ? 'English' : '中文'}
        </Button>

        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            M
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Meta Inc.</p>
            <p className="text-xs">{t.footer.internalTool}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

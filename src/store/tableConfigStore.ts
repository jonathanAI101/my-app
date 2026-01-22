'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 存储版本号
const STORAGE_VERSION = 1;

// 列配置
export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  canHide: boolean; // 是否可以隐藏
}

interface TableConfigStore {
  // 列配置
  columns: ColumnConfig[];

  // 列操作
  toggleColumnVisibility: (columnId: string) => void;
  setColumnVisibility: (columnId: string, visible: boolean) => void;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
  resetToDefaults: () => void;

  // 获取可见列
  getVisibleColumns: () => ColumnConfig[];
  isColumnVisible: (columnId: string) => boolean;
}

// 默认列配置
const defaultColumns: ColumnConfig[] = [
  { id: 'invoiceNumber', label: '发票号', visible: true, order: 0, canHide: false },
  { id: 'client', label: '客户', visible: true, order: 1, canHide: true },
  { id: 'amount', label: '金额', visible: true, order: 2, canHide: true },
  { id: 'issueDate', label: '开票日期', visible: true, order: 3, canHide: true },
  { id: 'dueDate', label: '到期日期', visible: true, order: 4, canHide: true },
  { id: 'status', label: '状态', visible: true, order: 5, canHide: true },
  { id: 'actions', label: '操作', visible: true, order: 6, canHide: false },
];

export const useTableConfigStore = create<TableConfigStore>()(
  persist(
    (set, get) => ({
      columns: defaultColumns,

      toggleColumnVisibility: (columnId) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId && col.canHide
              ? { ...col, visible: !col.visible }
              : col
          ),
        }));
      },

      setColumnVisibility: (columnId, visible) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId && col.canHide
              ? { ...col, visible }
              : col
          ),
        }));
      },

      reorderColumns: (fromIndex, toIndex) => {
        set((state) => {
          const newColumns = [...state.columns];
          const [movedColumn] = newColumns.splice(fromIndex, 1);
          newColumns.splice(toIndex, 0, movedColumn);

          // 更新 order
          return {
            columns: newColumns.map((col, index) => ({
              ...col,
              order: index,
            })),
          };
        });
      },

      resetToDefaults: () => {
        set({ columns: defaultColumns });
      },

      getVisibleColumns: () => {
        return get()
          .columns
          .filter((col) => col.visible)
          .sort((a, b) => a.order - b.order);
      },

      isColumnVisible: (columnId) => {
        const column = get().columns.find((col) => col.id === columnId);
        return column?.visible ?? true;
      },
    }),
    {
      name: 'invoice-table-config',
      storage: createJSONStorage(() => localStorage),
      version: STORAGE_VERSION,
      partialize: (state) => ({
        columns: state.columns,
      }),
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as { columns?: ColumnConfig[] };

        if (version === 0) {
          // 迁移旧数据：确保所有默认列都存在
          const existingIds = new Set(state.columns?.map((c) => c.id) ?? []);
          const missingColumns = defaultColumns.filter(
            (col) => !existingIds.has(col.id)
          );

          return {
            ...state,
            columns: [...(state.columns ?? []), ...missingColumns],
          };
        }

        return persistedState;
      },
    }
  )
);

// 列 ID 常量，方便类型安全
export const COLUMN_IDS = {
  INVOICE_NUMBER: 'invoiceNumber',
  CLIENT: 'client',
  AMOUNT: 'amount',
  ISSUE_DATE: 'issueDate',
  DUE_DATE: 'dueDate',
  STATUS: 'status',
  ACTIONS: 'actions',
} as const;

export type ColumnId = (typeof COLUMN_IDS)[keyof typeof COLUMN_IDS];

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { InvoiceFilters } from '@/types/invoice';

// 存储版本号
const STORAGE_VERSION = 1;

// 排序配置
export interface SortingState {
  field: string;
  direction: 'asc' | 'desc';
}

// 分页配置
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

// 表格状态
interface TableState {
  // 筛选状态
  filters: InvoiceFilters;
  // 排序状态
  sorting: SortingState | null;
  // 分页状态
  pagination: PaginationState;
}

interface TableStateStore extends TableState {
  // 筛选操作
  setFilters: (filters: Partial<InvoiceFilters>) => void;
  resetFilters: () => void;

  // 排序操作
  setSorting: (sorting: SortingState | null) => void;
  toggleSorting: (field: string) => void;

  // 分页操作
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  resetPagination: () => void;

  // 重置所有状态
  resetTableState: () => void;
}

// 默认状态
const defaultFilters: InvoiceFilters = {
  status: 'all',
  search: '',
  startDate: undefined,
  endDate: undefined,
};

const defaultPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

export const useTableStateStore = create<TableStateStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      filters: defaultFilters,
      sorting: null,
      pagination: defaultPagination,

      // 筛选操作
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          // 筛选改变时重置分页
          pagination: { ...state.pagination, pageIndex: 0 },
        }));
      },

      resetFilters: () => {
        set({
          filters: defaultFilters,
          pagination: { ...get().pagination, pageIndex: 0 },
        });
      },

      // 排序操作
      setSorting: (sorting) => {
        set({ sorting });
      },

      toggleSorting: (field) => {
        const { sorting } = get();
        if (sorting?.field === field) {
          // 同一字段切换方向
          if (sorting.direction === 'asc') {
            set({ sorting: { field, direction: 'desc' } });
          } else {
            // 取消排序
            set({ sorting: null });
          }
        } else {
          // 新字段默认升序
          set({ sorting: { field, direction: 'asc' } });
        }
      },

      // 分页操作
      setPageIndex: (pageIndex) => {
        set((state) => ({
          pagination: { ...state.pagination, pageIndex },
        }));
      },

      setPageSize: (pageSize) => {
        set((state) => ({
          pagination: { ...state.pagination, pageSize, pageIndex: 0 },
        }));
      },

      resetPagination: () => {
        set({ pagination: defaultPagination });
      },

      // 重置所有状态
      resetTableState: () => {
        set({
          filters: defaultFilters,
          sorting: null,
          pagination: defaultPagination,
        });
      },
    }),
    {
      name: 'invoice-table-state',
      storage: createJSONStorage(() => localStorage),
      version: STORAGE_VERSION,
      partialize: (state) => ({
        filters: state.filters,
        sorting: state.sorting,
        pagination: state.pagination,
      }),
    }
  )
);

// 用于获取排序后的数据的辅助函数
export function sortInvoices<T>(
  data: T[],
  sorting: SortingState | null
): T[] {
  if (!sorting) return data;

  return [...data].sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[sorting.field];
    const bValue = (b as Record<string, unknown>)[sorting.field];

    // 处理 null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sorting.direction === 'asc' ? 1 : -1;
    if (bValue == null) return sorting.direction === 'asc' ? -1 : 1;

    // 字符串比较
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sorting.direction === 'asc' ? comparison : -comparison;
    }

    // 数字比较
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sorting.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // 日期比较（ISO 字符串）
    if (
      typeof aValue === 'string' &&
      typeof bValue === 'string' &&
      !isNaN(Date.parse(aValue)) &&
      !isNaN(Date.parse(bValue))
    ) {
      const aDate = new Date(aValue).getTime();
      const bDate = new Date(bValue).getTime();
      return sorting.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }

    return 0;
  });
}

// 分页辅助函数
export function paginateData<T>(
  data: T[],
  pagination: PaginationState
): { paginatedData: T[]; totalPages: number; totalItems: number } {
  const { pageIndex, pageSize } = pagination;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = pageIndex * pageSize;
  const paginatedData = data.slice(start, start + pageSize);

  return { paginatedData, totalPages, totalItems };
}

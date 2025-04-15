import "./style.css";
import Pagination from "./Pagination";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CustomResponse } from "../../demo/DataTableDemo";

export interface DataTableProps<T> {
  columns: ColumnConfig<T>[]; // 列配置数组
  data?: T[]; // 表格数据（初始数据，可选）
  pagination?: PaginationProps | boolean; // 分页配置或禁用分页
  fetchData?: (currentPage: number, pageSize: number) => Promise<CustomResponse<T[]>>; // 数据获取函数
}

export interface ColumnConfig<T> {
  dataIndex: keyof T; // 列对应的数据字段
  label: string; // 列的显示名称
  sortable?: boolean; // 是否支持排序
  filterable?: boolean; // 是否支持过滤
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode; // 自定义渲染（表体）
  headerRender?: (column: ColumnConfig<T>, index: number) => React.ReactNode; // 自定义渲染（表头）
}

interface PaginationProps {
  currentPage: number; // 当前页码
  totalItems: number; // 数据总条数
  pageSize: number; // 每页显示条数
  onPageChange?: (page: number, pageSize: number) => void; // 页码变化回调
  onPageSizeChange?: (page: number, size: number) => void; // 每页条数变化回调
}

export default function DataTable<T>({
  columns,
  data,
  pagination,
  fetchData,
}: DataTableProps<T>) {
  // 初始数据（data 优先，否则空数组）
  const [dataSource, setDataSource] = useState<T[]>(data ?? []);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);
  const [loading, setLoading] = useState(false);

  // 初始化自定义分页（如果没有，则 undefined，不启用分页）
  const [customPagination, setCustomPagination] = useState<PaginationProps | undefined>(() => {
    if (pagination) {
      if (typeof pagination === "boolean") {
        return {
          currentPage: 1,
          totalItems: 0,
          pageSize: 10,
        };
      } else {
        return { ...pagination };
      }
    }
    return undefined;
  });

  // 数据过滤
  const filteredData = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return dataSource;
    return dataSource.filter((row) =>
      columns.every((col) => {
        if (col.filterable && filters[col.dataIndex as string]) {
          const value = String(row[col.dataIndex] ?? "").toLowerCase();
          return value.includes(filters[col.dataIndex as string].toLowerCase());
        }
        return true;
      })
    );
  }, [dataSource, filters, columns]);

  // 数据排序
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const { key, direction } = sortConfig;
    return [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 分页数据（仅当启用了分页时生效）
  const finalData = useMemo(() => {
    // 如果使用 fetchData，认为服务端返回的数据已经分页
    if (fetchData) {
      return sortedData;
    }
    if (customPagination) {
      const startIndex = (customPagination.currentPage - 1) * customPagination.pageSize;
      return sortedData.slice(startIndex, startIndex + customPagination.pageSize);
    }
    return sortedData;
  }, [sortedData, customPagination, fetchData]);

  // 数据加载：依赖 currentPage 与 pageSize 变化时调用 fetchData
  useEffect(() => {
    if (fetchData && customPagination) {
      setLoading(true);
      fetchData(customPagination.currentPage, customPagination.pageSize).then((res) => {
        if (res && res.data) {
          const { data, total } = res;
          setDataSource(data);
          setCustomPagination((prev) => {
            if (!prev) return prev;
            const newTotal = total ?? prev.totalItems;
            if (newTotal === prev.totalItems) {
              return prev;
            }
            return { ...prev, totalItems: newTotal };
          });
        }
      }).finally(() => {
        setLoading(false);
      });
    }
    // 仅依赖 currentPage 与 pageSize
  }, [fetchData, customPagination?.currentPage, customPagination?.pageSize]);

  // 处理分页变化：此处只更新状态，由 useEffect 发起数据加载
  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setCustomPagination((prev) => (prev ? { ...prev, currentPage: page, pageSize } : prev));
  }, []);

  // 处理排序
  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  // 处理过滤
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={String(col.dataIndex)}>
                <div onClick={() => col.sortable && !loading && handleSort(col.dataIndex)}>
                  {col.headerRender?.(col, index) ?? col.label}
                  {sortConfig?.key === col.dataIndex && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </div>
                {col.filterable && (
                  <input
                    type="text"
                    placeholder={`Filter ${col.label}`}
                    value={filters[col.dataIndex as string] || ""}
                    onChange={(e) => handleFilterChange(col.dataIndex as string, e.target.value)}
                    disabled={loading} 
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // 加载时占位行，跨越所有列
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
                Loading...
              </td>
            </tr>
          ) : finalData && finalData.length > 0 ? (
            finalData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={`${rowIndex}-${String(col.dataIndex)}`}>
                    {col.render ? col.render(row[col.dataIndex], row, rowIndex) : (row[col.dataIndex] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // 无数据占位符
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "20px" }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {customPagination && (
        <Pagination
          {...customPagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
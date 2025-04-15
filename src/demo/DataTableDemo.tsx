import DataTable, { ColumnConfig } from "../components/DataTable/DataTable";
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}
// 原始数据
const initialData: User[] = [
  { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 35, email: "charlie@example.com" },
];
export enum HttpStatusCode {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export interface CustomResponse<T> {
  data: T | null; // 支持空数据
  code: HttpStatusCode; // 使用枚举类型
  total?: number; // 可选字段，适用于分页接口
  message?: string; // 错误信息
  [key: string]: any; // 允许扩展其他字段
}
// 使用 Array.from 生成 97 条额外数据，并合并原始数据
const allData: User[] = [
  ...initialData,
  ...Array.from({ length: 97 }, (_, index) => ({
    id: initialData.length + index + 1,
    name: `User ${initialData.length + index + 1}`,
    age: 20 + ((initialData.length + index) % 30), // 年龄在 20 到 50 之间循环
    email: `user${initialData.length + index + 1}@example.com`,
  })),
];

// 模拟的 fetchData 函数
function mockFetchData(
  currentPage: number,
  pageSize: number
): Promise<CustomResponse<User[]>> {
  return new Promise((resolve) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);
    // 模拟网络延迟
    setTimeout(() => {
      resolve({ data: paginatedData, code: 200, total: allData.length });
    }, 500);
  });
}

const columns: ColumnConfig<User>[] = [
  {
    dataIndex: "name",
    label: "Name",
    sortable: true,
    render: (value) => <a href="#">{value}</a>,
  },
  { dataIndex: "age", label: "Age", sortable: true },
  { dataIndex: "email", label: "Email", filterable: true, sortable: true },
];
export default function DataTableDemo() {
  return (
    <>
      <h1>DataTable</h1>
      <DataTable<User> columns={columns} fetchData={mockFetchData} pagination />
    </>
  );
}

import { useState, useEffect, useRef } from "react";

export type AsyncState =
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; error: Error };

export interface LoadMoreOptions<T, ID> {
  // 获取所有数据项的标识集合，例如 id 列表
  fetchIds: () => Promise<ID[]>;
  // 根据某个 id 获取对应的数据项
  fetchItem: (id: ID) => Promise<T>;
  // 每页加载数量，默认 6
  pageSize?: number;
}

export default function useLoadMore<T, ID>(options: LoadMoreOptions<T, ID>) {
  const { fetchIds, fetchItem, pageSize = 6 } = options;
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<T[]>([]);
  const [ids, setIds] = useState<ID[]>([]);
  const [state, setState] = useState<AsyncState>({ status: "loading" });
  // 用于防止 fetchData 重复调用
  const isFetchingRef = useRef(false);
  const canLoadMore = items.length < ids.length;

  useEffect(() => {
    async function loadIds() {
      try {
        const data = await fetchIds();
        setIds(data);
      } catch (error: any) {
        setState({ status: "error", error });
      }
    }
    loadIds();
  }, [fetchIds]);

  useEffect(() => {
    if (ids.length > 0 && !isFetchingRef.current) {
      isFetchingRef.current = true;
      setState({ status: "loading" });
      fetchData(page);
    }
    async function fetchData(page: number) {
      try {
        const startIndex = page * pageSize;
        const endIndex = Math.min((page + 1) * pageSize, ids.length);
        const idsToFetch = ids.slice(startIndex, endIndex);
        const fetchPromises = idsToFetch.map((id) => fetchItem(id));
        const results = await Promise.all(fetchPromises);
        setItems((prevJobs) => [...prevJobs, ...results]);
        setState({ status: "success" });
      } catch (error: any) {
        setState({ status: "error", error });
      } finally {
        isFetchingRef.current = false;
      }
    }
  }, [page, ids]);

  return {
    items,
    state,
    canLoadMore,
    setPage,
  };
}

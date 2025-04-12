import { useState, useEffect, useRef } from "react";

export type AsyncState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; error: Error };

export interface LoadMoreOptions<T, ID> {
  fetchIds: () => Promise<ID[]>;
  fetchItem: (id: ID) => Promise<T>;
  pageSize?: number;
}

export default function useLoadMore<T, ID>(options: LoadMoreOptions<T, ID>) {
  const { fetchIds, fetchItem, pageSize = 6 } = options;
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<T[]>([]);
  const [ids, setIds] = useState<ID[]>([]);
  const [state, setState] = useState<AsyncState>({ status: "idle" });
  // 新增：标识是否已经尝试请求过 job 数据
  const [hasFetchedPage, setHasFetchedPage] = useState(false);
  const isFetchingRef = useRef(false);

  // 加载所有数据项的标识集合
  useEffect(() => {
    async function loadIds() {
      try {
        setState({ status: "loading" });
        const data = await fetchIds();
        if (data.length === 0) {
          setState({ status: "success" });
        } else {
          setIds(data);
        }
      } catch (error: any) {
        setState({ status: "error", error });
      } finally {
        // 注意：此处不要直接标记状态为 success，因为还没加载 job 数据
      }
    }
    loadIds();
  }, [fetchIds]);

  // 根据页码加载数据
  useEffect(() => {
    if (ids.length === 0 || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setState({ status: "loading" });

    async function loadPageData(currentPage: number) {
      try {
        const startIndex = currentPage * pageSize;
        const endIndex = Math.min((currentPage + 1) * pageSize, ids.length);
        const pageIds = ids.slice(startIndex, endIndex);

        if (pageIds.length === 0) return; // 没有更多数据

        const fetchPromises = pageIds.map((id) => fetchItem(id));
        const results = await Promise.all(fetchPromises);
        setItems((prev) => [...prev, ...results]);
      } catch (error: any) {
        setState({ status: "error", error });
      } finally {
        setHasFetchedPage(true);
        setState({ status: "success" });
        isFetchingRef.current = false;
      }
    }

    loadPageData(page);
  }, [page, ids, fetchItem, pageSize]);

  const canLoadMore = items.length < ids.length;

  return { items, state, canLoadMore, setPage, hasFetchedPage };
}
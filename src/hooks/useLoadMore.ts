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
  const isFetchingRef = useRef(false);

  // 加载所有数据项的标识集合
  useEffect(() => {
    async function loadIds() {
      try {
        setState({ status: "loading" });
        const data = await fetchIds();
        if (data.length === 0) {
          setState({ status: "success" }); // 如果没有数据，直接标记为成功
        } else {
          setIds(data);
        }
      } catch (error: any) {
        setState({ status: "error", error });
      } finally {
        if (state.status !== "error") {
          setState({ status: "success" });
        }
      }
    }
    loadIds();
  }, [fetchIds]);

  // 根据页码加载数据
  useEffect(() => {
    if (ids.length === 0 || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setState({ status: "loading" });

    async function loadPageData(page: number) {
      try {
        const startIndex = page * pageSize;
        const endIndex = Math.min((page + 1) * pageSize, ids.length);
        const idsToFetch = ids.slice(startIndex, endIndex);

        if (idsToFetch.length === 0) {
          return; // 没有更多数据需要加载
        }

        const fetchPromises = idsToFetch.map((id) => fetchItem(id));
        const results = await Promise.all(fetchPromises);
        setItems((prevItems) => [...prevItems, ...results]);
      } catch (error: any) {
        setState({ status: "error", error });
      } finally {
        isFetchingRef.current = false;
        setState({ status: "success" });
      }
    }

    loadPageData(page);
  }, [page, ids, pageSize]);

  const canLoadMore = items.length < ids.length;

  return {
    items,
    state,
    canLoadMore,
    setPage,
  };
}
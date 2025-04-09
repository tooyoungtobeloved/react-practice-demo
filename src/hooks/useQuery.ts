import { DependencyList, useEffect, useState } from "react";

type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export default function useQuery<T>(
  fn: () => Promise<T>,
  deps: DependencyList = []
): AsyncState<T> {
  const [asyncState, setAsyncState] = useState<AsyncState<T>>({
    status: "loading",
  });
  useEffect(() => {
    setAsyncState({ status: "loading" });
    let isMounted = true;
    Promise.resolve(fn()).then(
      (data) => {
        if(isMounted) setAsyncState({ status: "success", data })
      },
      (error: Error) => { 
        if(isMounted) setAsyncState({ status: "error", error })
      }
    );
    return () => {
      isMounted = false;
    };
  }, deps);

  return asyncState;
}

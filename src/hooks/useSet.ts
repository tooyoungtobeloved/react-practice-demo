import { useState, useCallback, useRef } from 'react';

export interface UseSetReturn<T> {
  readonly set: Set<T>;
  add: (key: T) => void;
  remove: (key: T) => void;
  toggle: (key: T) => void;
  reset: () => void;
  clear: () => void;
}

export default function useSet<T>(initialState?: Iterable<T>): UseSetReturn<T> {
  const initialSet = useRef(initialState instanceof Set ? initialState : new Set(initialState));
  const [state, setState] = useState<Set<T>>(new Set(initialState));
  // 所有操作都通过 setState 触发重新渲染
  const add = useCallback((key: T) => {
    setState(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const remove = useCallback((key: T) => {
    setState(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const toggle = useCallback((key: T) => {
    setState(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialSet.current);
  }, []);

  const clear = useCallback(() => {
    setState(new Set());
  }, []);

  return {
    set: state,
    add,
    remove,
    toggle,
    reset,
    clear,
  };
}
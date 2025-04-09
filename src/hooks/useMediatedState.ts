import { Dispatch, SetStateAction, useState, useRef } from "react";

type StateMediator<S> =
  | ((newState: S) => S)
  | ((newState: S, dispatch: Dispatch<SetStateAction<S>>) => void);

export default function useMediatedState<S>(
  mediator: StateMediator<S>,
  initialState: S
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setInnerState] = useState<S>(initialState);
  const mediatorRef = useRef(mediator);

  // 保证 mediator 的引用稳定
  mediatorRef.current = mediator;

  const setState: Dispatch<SetStateAction<S>> = (reactState) => {
    const resolveValue =
      typeof reactState === "function"
        ? (reactState as (prevState: S) => S)(state)
        : reactState;

    if (mediatorRef.current.length >= 2) {
      // 如果 mediator 接收两个参数，则调用第二种形式
      mediatorRef.current(
        resolveValue,
        setInnerState
      );
    } else {
      // 如果 mediator 接收一个参数，则调用第一种形式
      setInnerState((mediatorRef.current as (newState: S) => S)(resolveValue));
    }
  };

  return [state, setState];
}
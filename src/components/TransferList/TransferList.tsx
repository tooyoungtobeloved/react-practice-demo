import "./style.css";
import { useState } from "react";

interface Item {
  id: number;
  name: string;
}

interface TransferItem extends Item {
  checked: boolean;
}

interface TransferListProps {
  dataSource: Item[];
  targetKeys: number[];
}

export default function TransferList({
  dataSource,
  targetKeys,
}: TransferListProps) {
  const [left, setLeft] = useState<TransferItem[]>(() => {
    return dataSource
      .filter((item) => !targetKeys.includes(item.id))
      .map((item) => ({ ...item, checked: false }));
  });
  const [right, setRight] = useState<TransferItem[]>(() => {
    return dataSource
      .filter((item) => targetKeys.includes(item.id))
      .map((item) => ({ ...item, checked: false }));
  });

  // 通用：切换指定数据项的 checked 状态
  const toggleItem = (items: TransferItem[], id: number): TransferItem[] =>
    items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );

  const handleLeftCheck = (id: number) => {
    setLeft((prev) => toggleItem(prev, id));
  };

  const handleRightCheck = (id: number) => {
    setRight((prev) => toggleItem(prev, id));
  };

  // 通用：转移 from 数组中被选中的项到 to 数组
  const transferItems = (
    from: TransferItem[],
    to: TransferItem[],
    setFrom: (items: TransferItem[]) => void,
    setTo: (items: TransferItem[]) => void
  ) => {
    const selectedItems = from.filter((item) => item.checked);
    const unselectedItems = from.filter((item) => !item.checked);
    setFrom(unselectedItems);
    setTo([...to, ...selectedItems]);
  };

  // 转移所有数据（无论是否选中）
  const transferAll = (
    from: TransferItem[],
    to: TransferItem[],
    setFrom: (items: TransferItem[]) => void,
    setTo: (items: TransferItem[]) => void
  ) => {
    setTo([...to, ...from]);
    setFrom([]);
  };

  const transferToLeft = () => transferItems(right, left, setRight, setLeft);
  const transferToRight = () => transferItems(left, right, setLeft, setRight);
  const transferAllToLeft = () => transferAll(right, left, setRight, setLeft);
  const transferAllToRight = () => transferAll(left, right, setLeft, setRight);

  // 根据是否存在被选中的项，计算按钮是否禁用
  const disabledLeft =
    right.length === 0 || !right.some((item) => item.checked);
  const disabledRight = left.length === 0 || !left.some((item) => item.checked);

  return (
    <div className="container">
      <div className="transferLeft">
        <ul>
          {left.map((item) => (
            <li key={item.id}>
              <input
                type="checkbox"
                id={`left-${item.id}`}
                name={item.name}
                checked={item.checked}
                onChange={() => handleLeftCheck(item.id)}
              />
              <label htmlFor={`left-${item.id}`}>{item.name}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className="transfer">
        <div className="btn">
          <button
            disabled={left.length === dataSource.length}
            onClick={transferAllToLeft}
          >
            {"<<"}
          </button>
          <button disabled={disabledLeft} onClick={transferToLeft}>
            {"<"}
          </button>
          <button disabled={disabledRight} onClick={transferToRight}>
            {">"}
          </button>
          <button
            disabled={right.length === dataSource.length}
            onClick={transferAllToRight}
          >
            {">>"}
          </button>
        </div>
      </div>
      <div className="transferRight">
        <ul>
          {right.map((item) => (
            <li key={item.id}>
              <input
                type="checkbox"
                id={`right-${item.id}`}
                name={item.name}
                checked={item.checked}
                onChange={() => handleRightCheck(item.id)}
              />
              <label htmlFor={`right-${item.id}`}>{item.name}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

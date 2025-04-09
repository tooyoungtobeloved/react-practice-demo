export interface CheckboxItemData {
  id: number;
  name: string;
  children?: CheckboxItemData[];
}
export interface CheckBoxNodeWithCustomState extends CheckboxItemData {
  parentId?: number;
  checked: boolean | "indeterminate";
  children?: CheckBoxNodeWithCustomState[];
}
export interface CheckboxesProps {
  defaultCheckboxData: CheckboxItemData[];
}

export interface CheckBoxNodeProps {
  checkBoxData: CheckBoxNodeWithCustomState;
  onChange: (data: CheckBoxNodeWithCustomState) => void;
}

export function allChildNodeChecked<T extends { id: number; checked: boolean | "indeterminate"; children?: T[] }>(
  node: T
): boolean | "indeterminate" {
  if (!node.children || node.children.length === 0) {
    return node.checked === true; // 如果没有子节点，默认返回全不选
  }

  let allChecked = true; // 假设所有子节点都被选中
  let noneChecked = true; // 假设所有子节点都未被选中

  for (const child of node.children) {
    const childState = allChildNodeChecked(child); // 递归检查子节点

    if (childState === true) {
      noneChecked = false; // 如果有子节点被选中，则不是全不选
    } else if (childState === false) {
      allChecked = false; // 如果有子节点未被选中，则不是全选
    } else if (childState === "indeterminate") {
      return "indeterminate"; // 如果子节点是半选状态，直接返回半选
    }
  }

  if (allChecked) {
    return true; // 所有子节点都被选中
  }
  if (noneChecked) {
    return false; // 所有子节点都未被选中
  }
  return "indeterminate"; // 部分子节点被选中
}

export function transferData(
  data: CheckboxItem[],
  parentId?: number
): CheckboxItem[] {
  return data.map((item) => {
    const base = { ...item, parentId, checked: false };
    if (item.children) {
      return { ...base, children: transferData(item.children, item.id) };
    }
    return base;
  });
}
export function updaterSpeificNode<T extends { id: number; children?: T[] }>(
  items: T[],
  matchNode: (item: T) => boolean,
  updater: (node: T) => T
): T[] {
  return items.map((item) => {
    if (matchNode(item)) {
      const updatedNode = updater(item); // 更新当前节点
      return {
        ...updatedNode,
        ...(item.children
          ? { children: updaterSpeificNode(item.children, matchNode, updater) } // 递归处理子节点
          : {}), // 仅在有子节点时添加 children 属性
      };
    }
    if (item.children) {
      return {
        ...item,
        children: updaterSpeificNode(item.children, matchNode, updater),
      };
    }
    return item;
  });
}
export function updateTreeNode<T extends { id: number; children?: T[] }>(
  items: T[],
  targetId: number,
  updater: (node: T) => T
): T[] {
  return updaterSpeificNode(items, (node) => node.id === targetId, updater);
}

export function getAllChildNode<T extends { id: number; children?: T[] }>(
  item: T
): number[] | [] {
  if (!item.children || item.children.length === 0) {
    return [];
  }
  return item.children.reduce((acc, cur) => {
    return [...acc, cur.id, ...getAllChildNode(cur)];
  }, [] as number[]);
}

export function findNode<T extends { children?: T[] }>(
  nodes: T[],
  callback: (node: T) => boolean
): T | undefined {
  for (const n of nodes) {
    if (callback(n)) {
      return n;
    }
    if (n.children) {
      const node = findNode(n.children, callback);
      if (node) {
        return node;
      }
    }
  }
  return undefined;
}

export function getAllParentNodeIds<
  T extends { id: number; children?: T[]; parentId?: number }
>(items: T[], parentId?: number): number[] {
  if (!parentId) return [];
  const parentIds: number[] = [parentId];
  let node = findNode(items, (currentNode) => currentNode.id === parentId);
  while (node?.parentId) {
    parentIds.push(node.parentId);
    node = findNode(items, (currentNode) => currentNode.id === node?.parentId);
  }
  return parentIds;
}

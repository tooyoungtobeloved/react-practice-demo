import "./style.css";
import { useState, ChangeEvent } from "react";
import { allChildNodeChecked, getAllParentNodeIds } from "./utils.ts";
import type {
  CheckBoxNodeWithCustomState,
  CheckboxesProps,
  CheckBoxNodeProps,
} from "./utils";
import { transferData, updaterSpeificNode, getAllChildNode } from "./utils.ts";

function CheckBoxNode({ checkBoxData, onChange }: CheckBoxNodeProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...checkBoxData,
      checked: !e.target.checked,
    });
  };

  return (
    <div>
      <input
        type="checkbox"
        id={String(checkBoxData.id)}
        name={String(checkBoxData.id)}
        checked={checkBoxData.checked === "indeterminate" ? false : checkBoxData.checked}
        ref={(el) => {
          if (el) el.indeterminate = checkBoxData.checked === "indeterminate";
        }}
        onChange={handleChange}
      />
      <label htmlFor={String(checkBoxData.id)}>{checkBoxData.name}</label>
    </div>
  );
}

export function CheckBoxNodeContainer({
  checkBoxData,
  onChange,
}: {
  checkBoxData: CheckBoxNodeWithCustomState[];
  onChange: (data: CheckBoxNodeWithCustomState) => void;
}) {
  return (
    <ul>
      {checkBoxData.map((checkBoxDataItem) => (
        <li key={checkBoxDataItem.id}>
          <CheckBoxNode checkBoxData={checkBoxDataItem} onChange={onChange} />
          {checkBoxDataItem.children && checkBoxDataItem.children.length > 0 && (
            <CheckBoxNodeContainer
              checkBoxData={checkBoxDataItem.children}
              onChange={onChange}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function NestCheckBox({ defaultCheckboxData }: CheckboxesProps) {
  const [checkBoxData, setCheckBoxData] = useState<CheckBoxNodeWithCustomState[]>(
    () => transferData(defaultCheckboxData)
  );

  // 更新当前节点
  const updateCurrentNode = (
    data: CheckBoxNodeWithCustomState,
    prev: CheckBoxNodeWithCustomState[]
  ) => {
    return updaterSpeificNode(
      prev,
      (node) => node.id === data.id,
      (node) => ({ ...node, checked: !data.checked })
    );
  };

  // 更新子节点
  const updateChildNodes = (
    data: CheckBoxNodeWithCustomState,
    updatedNodes: CheckBoxNodeWithCustomState[]
  ) => {
    const childList: number[] = getAllChildNode(data);
    if (childList.length > 0) {
      return updaterSpeificNode(
        updatedNodes,
        (node) => childList.includes(node.id),
        (node) => ({ ...node, checked: !data.checked })
      );
    }
    return updatedNodes;
  };

  // 更新父节点
  const updateParentNodes = (
    data: CheckBoxNodeWithCustomState,
    updatedNodes: CheckBoxNodeWithCustomState[]
  ) => {
    const allParentsNodes = getAllParentNodeIds(updatedNodes, data.parentId);
    if (allParentsNodes.length > 0) {
      return updaterSpeificNode(
        updatedNodes,
        (node) => allParentsNodes.includes(node.id),
        (node) => {
          const state = allChildNodeChecked(node);
          return { ...node, checked: state };
        }
      );
    }
    return updatedNodes;
  };

  function onNodeChange(data: CheckBoxNodeWithCustomState) {
    setCheckBoxData((prev) => {
      let updatedNodes = updateCurrentNode(data, prev); // 更新当前节点
      updatedNodes = updateChildNodes(data, updatedNodes); // 更新子节点
      updatedNodes = updateParentNodes(data, updatedNodes); // 更新父节点
      return updatedNodes;
    });
  }

  return (
    <CheckBoxNodeContainer
      checkBoxData={checkBoxData}
      onChange={onNodeChange}
    />
  );
}
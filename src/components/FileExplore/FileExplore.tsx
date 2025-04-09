import React, { useState } from "react";

interface FileItem {
  id: number;
  name: string;
  children?: FileItem[];
}

export default function FileExplore({ data }: { data: FileItem[] }) {
  return (
    <ul style={styles.list}>
      {data.map((item) => (
        <TreeNode key={item.id} file={item} />
      ))}
    </ul>
  );
}

const TreeNode = React.memo(({ file }: { file: FileItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <li style={file.children ? styles.folder : styles.file}>
      <div onClick={file.children ? toggleOpen : undefined} style={styles.node}>
        {file.name}{" "}
        {file.children && (
          <span style={styles.toggle}>{isOpen ? "[-]" : "[+]"}</span>
        )}
      </div>
      {isOpen && file.children && <FileExplore data={file.children} />}
    </li>
  );
});

const styles: Record<string, React.CSSProperties> = {
  list: {
    listStyle: "none",
    paddingLeft: "10px",
  },
  folder: {
    fontWeight: "bold",
    cursor: "pointer",
  },
  file: {
    fontWeight: "normal",
  },
  node: {
    display: "flex",
    alignItems: "center",
  },
  toggle: {
    marginLeft: "5px",
    cursor: "pointer",
    color: "blue",
  },
};
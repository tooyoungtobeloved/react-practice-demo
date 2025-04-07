import { useState } from "react";

export default function FileExplore({ data }) {
  return (
    <ul>
      {
        data.map(item => {
          return <TreeNode key={item.id} file={item} />
        })
      }
    </ul>
  );
}

function TreeNode ({ file }) {
  const [open, setOpen] = useState(false)
  function handleClick () {
    setOpen(!open)
  }
  return (
    file.children ? 
    <li style={{fontWeight: 'bold'}}>
      <div key={file.id}>{file.name} <span onClick={() => handleClick()}>{open ? `[-]` : '[+]'}</span></div>
      { open && <FileExplore data={file.children} />}
    </li> :
    <li key={file.id}>{file.name}</li>
  )
}
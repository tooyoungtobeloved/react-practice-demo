import TransferList from "../components/TransferList/TransferList"
const dataSource = [
    { id: 1, name: "HTML" },
    { id: 2, name: "JavaScript" },
    { id: 3, name: "CSS" },
    { id: 4, name: "TypeScript" },
    { id: 5, name: "React" },
    { id: 6, name: "Angular" },
    { id: 7, name: "Vue" },
    { id: 8, name: "Svelte" },
  ]
export default function TransferListDemo() {
  return (
    <div>
      <TransferList dataSource={dataSource} targetKeys={[1, 2, 3, 4]} />
    </div>
  )
}
import NestedCheckboxes from '../components/NestedCheckboxes/NestedCheckboxes.js'
const fileData = [
    {
      id: 1,
      name: "Electronics",
      children: [
        {
          id: 2,
          name: "Mobile phones",
          children: [
            {
              id: 3,
              name: "iPhone",
            },
            {
              id: 4,
              name: "Android",
            },
          ],
        },
        {
          id: 5,
          name: "Laptops",
          children: [
            {
              id: 6,
              name: "MacBook",
            },
            {
              id: 7,
              name: "Surface Pro",
            },
          ],
        },
      ],
    },
    {
      id: 8,
      name: "Books",
      children: [
        {
          id: 9,
          name: "Fiction",
        },
        {
          id: 10,
          name: "Non-fiction",
        },
      ],
    },
    {
      id: 11,
      name: "Toys",
    },
  ];
export default function NestedCheckboxesDemo() {
    return (
        <div style={{display: 'flex', gap: '1rem'}}>
            <NestedCheckboxes defaultCheckboxData={fileData} />
            <pre style={{textAlign: 'left'}}>
              {JSON.stringify(fileData, null, 2)}
            </pre>
        </div>
    )
}
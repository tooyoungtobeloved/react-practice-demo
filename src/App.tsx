import './App.css'
import TodoListDemo from './demo/TodoListDemo';
// import Child from './components/Child'
// import Set from './components/Set'
// import FileExplore from './components/FileExplore.jsx'
// import DialogDemo from './demo/DialogDemo'
// import DiceRollDemo from './demo/DiceRollDemo'
// import StarRatingDemo from './demo/StarRatingDemo'
const data = [
  {
    id: 1,
    name: 'README.md',
  },
  {
    id: 2,
    name: 'Documents',
    children: [
      {
        id: 3,
        name: 'Word.doc',
      },
      {
        id: 4,
        name: 'Powerpoint.ppt',
      },
    ],
  },
  {
    id: 5,
    name: 'Downloads',
    children: [
      {
        id: 6,
        name: 'unnamed.txt',
      },
      {
        id: 7,
        name: 'Misc',
        children: [
          {
            id: 8,
            name: 'foo.txt',
          },
          {
            id: 9,
            name: 'bar.txt',
          },
        ],
      },
    ],
  },
];
function App() {
  return (
    <>
      <TodoListDemo />
    </>
  )
}

export default App

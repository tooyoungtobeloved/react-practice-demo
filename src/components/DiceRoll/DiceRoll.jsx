import './style.css'
import { useState } from 'react';
const valueMapArr = {
  1: ['center-center'],
  2: ['bottom-left', 'top-right'],
  3: ['center-center', 'bottom-left', 'top-right'],
  4: ['bottom-left', 'top-right', 'bottom-right', 'top-left'],
  5: ['bottom-left', 'top-right', 'bottom-right', 'top-left', 'center-center'],
  6: ['bottom-left', 'top-right', 'bottom-right', 'top-left', 'center-left', 'center-right'],
}
export default function DiceRoll() {
  const [diceNumber, setDiceNumber] = useState(1);
  const [rollList, setRollList] = useState([]);
  function handleRoll() {
    setRollList(new Array(diceNumber).fill(0).map(() => Math.floor(Math.random() * 6) + 1))
  }
  return <div>
    <div>Number of dice</div>
    <input style={{border: '1px solid', width: '150px'}} value={diceNumber} onChange={e => setDiceNumber(Number(e.target.value))} type="number" min={1} max={12}/>
    <button onClick={handleRoll}>Roll</button>
    <div className="roll-container">
      {
        rollList.map((item, index) => {
          return <Dice key={index} value={item}/>
        })
      }
    </div>
  </div>;
} 
function Dice (props) {

  function renderDice() {
      return  valueMapArr[props.value].map(item => {
        return <div key={item} className={item + ' roll-item dot '}></div>
      })
  }


  return (
    <div className="roll">
      <div className="roll-out">
        {renderDice()}
      </div>
    </div>
  )
}
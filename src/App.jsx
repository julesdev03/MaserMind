import { useState } from 'react'
import './App.css'
import { Popover, Button } from "antd";

function getRandomSelection(array, count) {
  if (count <= 0) {
    throw new Error("Count must be greater than 0");
  }

  const selected = [];

  while (selected.length < count) {
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * array.length);
    // Add the randomly selected item to the result
    selected.push(array[randomIndex]);
  }
  console.log(selected);
  return selected;
}

let winningCombination;
  
function App() {
  // Pagination
  const [page, setPage] = useState('start');
  const [isGameWon, setIsGameWon] = useState(false);

  let pageContent = null;
  if (page == 'start') {
    pageContent = <LandPage setPage={setPage}/>
  } else if (page == 'game-master-mind') {
    pageContent = <GamePage setPage={setPage} setIsGameWon={setIsGameWon}/>
  }

  const closePopup = () => {
    setIsGameWon(false);
    setPage('start');
  };

  return (
    <>
      <div id='page'>
        {pageContent}
        {isGameWon && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h1>Congratulations!</h1>
            <p>The Computer selection was:</p>
            <div className='flexer gap centered' style={{marginBottom:'1rem'}}>
              {winningCombination.map((item, index)=> (
                <div className={`bubble ${item}`} key={index}></div>
              ))}
            </div>
            <button className='button' onClick={closePopup}>BACK TO MENU</button>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

function LandPage({ setPage }) {

  function handleClickPage(){
    winningCombination = getRandomSelection(['red', 'yellow', 'black', 'purple', 'blue', 'green'], 4);
    setPage('game-master-mind')
  }

  return (
    <>
    <div className='box-start'>
      <h1>MasterMind</h1>
      <button className='button' onClick={handleClickPage}>START</button>
    </div>
    </>
  )
}

function HeaderGame(){
  return (
    <>
    <div className='header-game flexer flexer-column centered gap'>
        <h1>MasterMind</h1>
        <div className='flexer gap'>
          <div className='bubble red'></div>
          <div className='bubble yellow'></div>
          <div className='bubble blue'></div>
          <div className='bubble green'></div>
          <div className='bubble purple'></div>
          <div className='bubble black'></div>
        </div>
      </div></>
  )
}

function ComputerMind({ winningCombination }) {
  return (
    <div className='flexer flexer-column'>
        <h2>Computer's mind</h2>
        <div className={`flexer gap centered container-fade`}>
        {winningCombination.map((item, index)=> (
        <div className='bubble' key={index}></div>
      ))}
        </div>
      </div>
  )
}

function checkActive(input) {
  let rowChecker = false;
  for(let i=0; i < 10; i++) {
    let checker = 0;
    for (let j=0;j<4; j++) {
      if(input[i][j]['color'] != null) {
        checker++;
      }
      if (j == 3 && checker != 4 && rowChecker==true) {
        input.forEach(row => {
          row.forEach(element => {
            element.active = null;
          });
        });
        input[i].forEach(element => {
          element.active = 'active-bubble';
        });
        return input;
      }
      if (j == 3 && checker == 4) {
        rowChecker = true;
      }
    }
  }
  return input;
}

function activeChecker(input) {
  for(let i=0; i < 10; i++) {
    for (let j=0;j<4; j++) {
      if (input[i][j].active != null) {
        return i
      }
    }}
}

function compareLists(list1, list2) {
  const result = {
    sameIndex: [],         // Elements in both lists at the same index
    differentIndex: [],    // Elements in both lists but at different indices
    onlyInList1: []        // Elements in list1 but not in list2
  };
  let setList1 = new Set();
  let setList2 = new Set();

  // Compare elements at the same index
  list1.forEach((item, index) => {
      if (list2[index] === item) {
          setList1.add(index);
          setList2.add(index);
          result.sameIndex.push(list2[index]);
      }
  });

  // Check for elements in list1 that exist in list2 but at a different index
  list1.forEach((item, index) => {
    // Only check if not already in the list of used ones
    if (!setList1.has(index)) {
      // Find indexes in list2
      const foundIndexes = list2.reduce((acc, current, index) => {
        if (current === item) acc.push(index);
        return acc;
      }, []);
      // Check if these indexes are not already used, otherwise add one of them
      let isDifferent = false;
      for (let i = 0; i < foundIndexes.length; i++) {
        if (!setList2.has(foundIndexes[i])) {
          setList1.add(index);
          setList2.add(foundIndexes[i]);
          result.differentIndex.push(item);
          isDifferent = true;
          break;
        }
      }
      if (isDifferent == false) {
        result.onlyInList1.push(item);
      }
    }  
  });
  return result;
}

function computerLogic(inputUser, inputComputer) {
  const listUser = inputUser.map(element => element.color);

  let listResutls = compareLists(listUser, inputComputer);
  let toReturn = [];
  for (const key in listResutls) {
    if (key == 'sameIndex') {
      for (const element in listResutls[key]) {
        toReturn.push('white')
      }
    }
    if (key == 'differentIndex') {
      for (const element in listResutls[key]) {
        toReturn.push('black')
      }
    }
    if (key == 'onlyInList1') {
      for (const element in listResutls[key]) {
        toReturn.push('grey')
      }
    }
  }
  let indexer = 0;
  let returner = [];
  for (let element in toReturn) {
    returner.push({'color': toReturn[element], index: [inputUser[0]['index'][0], indexer]});
    indexer++;
  }

  return returner;
  
}

function ClickableBubble({bubbleProperties, setGameBubbles, gameBubbles, computerBubbles, setComputerBubbles, setPage, setIsGameWon}) {

  function changeColor() {
    let newGameBubble = [...gameBubbles.map(row => [...row.map(bubble => ({ ...bubble }))])];
    newGameBubble[bubbleProperties['index'][0]][bubbleProperties['index'][1]]['color'] = bubbleProperties['color'];
    // Check who is active
    newGameBubble = checkActive(newGameBubble);

    setGameBubbles(newGameBubble);

    // If change in active: computer turn
    let activeRow = [{}];
    let activeOg = activeChecker(gameBubbles);
    let activeNew = activeChecker(newGameBubble);
    if (activeNew != activeOg) {
      activeRow = computerLogic(newGameBubble[activeOg], winningCombination);
      let newComputerBoard = [...computerBubbles.map(row => [...row.map(bubble => ({ ...bubble }))])];
      newComputerBoard[activeOg] = activeRow;
      setComputerBubbles(newComputerBoard);
      console.log(activeRow);
    }
    // Check if won
    const allSameColor = activeRow.every(obj => obj.color === "white");
    if (allSameColor) {
      setIsGameWon(true);
      console.log("Won");
    }
  }
  
  return(
    <>
    <div className={`bubble ${bubbleProperties['color']}`} onClick={changeColor}></div>
    
    </>   
  )
}

function ModifBubble({ setIsGameWon, bubbleProperties, setGameBubbles, gameBubbles, computerBubbles, setComputerBubbles, setPage }) {

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  function closePopover() {
    setOpen(false);
  }

  function setContentPopover() {
    let listContent = [];
    const listColors = ['red', 'black', 'purple', 'yellow', 'blue', 'green'];
    for (let i=0; i<listColors.length; i++) {
      listContent.push({'color': listColors[i], 'index': bubbleProperties['index'], 'active': bubbleProperties['active']})
    }
    return (<div className='flexer gap' onClick={closePopover}>
      {listContent.map((bubble, index) => (
        <>
        <ClickableBubble setIsGameWon={setIsGameWon} bubbleProperties={bubble} setGameBubbles={setGameBubbles} gameBubbles={gameBubbles} computerBubbles={computerBubbles} setComputerBubbles={setComputerBubbles} setPage={setPage}/>
        </>
      ))}
    </div>)
  }

  let content;
  function setContent() {
    
    if (bubbleProperties['active'] == 'active-bubble') {
      content = <Popover
      content={ setContentPopover() }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className={`bubble ${bubbleProperties['color']}`}></div>
    </Popover>
    }
    else {
      content = <div className={`bubble ${bubbleProperties['color']}`}></div>  
    }
  }
  setContent();

  return (
    <>
    {content}
    </>
  )
}

function GamePage({ setPage, setIsGameWon }) {
  function handleClickPage(){
    setPage('start')
  }

  let stateBubbles = () => {
    let bubbleTable = [];
    for (let i=0; i < 10; i++) {
      let bubbles = [];
      let isActive = null;
      if(i == 0){
        isActive = 'active-bubble';
      }
      for (let j=0; j<4; j++) {
        let indBubble = {'color': null, 'index': [i, j], 'active': isActive}
        bubbles.push(indBubble);
      }
      bubbleTable.push(bubbles);
    }
    return bubbleTable;
  }

  const [gameBubbles, setGameBubbles] = useState(
    stateBubbles
  );
  const [computerBubbles, setComputerBubbles] = useState(
    stateBubbles
  );
  
  return (
    <>
    <div id='game-container' className='flexer flexer-column centered gap'>
      <HeaderGame></HeaderGame>
      <ComputerMind winningCombination={winningCombination}/>

      <div id="game-table" className='flexer flexer-column centered'>
      <table style={{width: '100%', maxWidth: "380px"}}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Computer</th>
          </tr>
        </thead>
        <tbody className=''>

        
        {
  gameBubbles.map((row, indexItem) => (
    <tr key={indexItem} className=''>
      <td key={indexItem} className=''>
        <div className='flexer gap centered'>
        {
        row.map((bubble, indexColor) => (
            <ModifBubble setIsGameWon={setIsGameWon} setPage={setPage} bubbleProperties={bubble} setGameBubbles={setGameBubbles} gameBubbles={gameBubbles} computerBubbles={computerBubbles} setComputerBubbles={setComputerBubbles}/>
        ))
        }
        </div>
        
      </td>
      <td key={indexItem+200}>
        <div className='flexer centered' style={{gap :'.4rem'}}>
        {computerBubbles[indexItem].map((bubble, indexColor) => (
        <div className={`bubble ${bubble['color']}`}></div>
    ))}
        </div>
      
      </td>
      
    </tr>
  ))
}
        </tbody>
      </table>
      </div>

      <button className='button' onClick={handleClickPage}>BACK TO MENU</button>

    </div>
    </>
  )
}

export default App

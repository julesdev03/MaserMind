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
let optionsSelection;
  
function App() {
  // Pagination
  const [page, setPage] = useState('start');
  const [isGameWon, setIsGameWon] = useState({'status': false, "message":""});
  const [gameParameters, setGameParameters] = useState({'tries': 10, 'colors': 6, 'pick': 4});

  let pageContent = null;
  if (page == 'start') {
    pageContent = <LandPage setterGameParameters={setGameParameters} gameParameters={gameParameters} setPage={setPage}/>
  } else if (page == 'game-master-mind') {
    pageContent = <GamePage setterGameParameters={setGameParameters} gameParameters={gameParameters} setPage={setPage} setIsGameWon={setIsGameWon}/>
  }

  const closePopup = () => {
    setIsGameWon({'status': false, "message":""});
    setPage('start');
  };

  return (
    <>
      <div id='page'>
        {pageContent}
        {isGameWon.status && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h1>{isGameWon.message}</h1>
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

function SlidersPick({options, title, defaultValue, gameParameters, setterGameParameters}) {
  const [selectedIndex, setSelectedIndex] = useState(options.indexOf(gameParameters[defaultValue]));

  function handleOptionClick(index) {
    setSelectedIndex(index);
    let currentValue = {...gameParameters};
    currentValue[defaultValue] = options[index];
    setterGameParameters(currentValue);
  };

  return (
    <div style={{width: "80%"}}>
      <p style={{'color': 'rgb(0, 136, 255)', 'fontWeight': 'bold'}}>{title}</p>
      <div className="picker-container">
      <div
        className="slider"
        style={{
          transform: `translateX(${selectedIndex * 100}%)`,
          width: `calc(100% / ${options.length})`,
        }}
      ></div>
      {options.map((option, index) => (
        <div
          key={index}
          className={`picker-option ${
            index === selectedIndex ? "selected" : ""
          }`}
          onClick={() => handleOptionClick(index)}
        >
          {option}
        </div>
      ))}
    </div>
    </div>
    
  );
}

function LandPage({ setPage, gameParameters, setterGameParameters }) {

  function handleClickPage(){
    optionsSelection = ['red', 'yellow', 'black', 'purple', 'blue', 'green'];
    if(gameParameters.colors == 7) {
      optionsSelection.push('rose');
    }
    if (gameParameters.colors == 8) {
      optionsSelection.push('rose');
      optionsSelection.push('orange');
    }
    winningCombination = getRandomSelection(optionsSelection, gameParameters.pick);
    setPage('game-master-mind');
  }

  return (
    <>
    <div className='box-start flexer flexer-column gap'>
      <h1 style={{'margin': '0'}}>MasterMind</h1>
      <SlidersPick options={[10, 11, 12]} defaultValue={'tries'} gameParameters={gameParameters} setterGameParameters={setterGameParameters} title="Pick the amount of tries:"/>
      <SlidersPick options={[6, 7, 8]} defaultValue={'colors'} gameParameters={gameParameters} setterGameParameters={setterGameParameters} title="Pick the amount colors:"/>
      <SlidersPick options={[4, 5]} defaultValue={'pick'} gameParameters={gameParameters} setterGameParameters={setterGameParameters} title="Pick the amount of computer's pick:"/>
      <button className='button' onClick={handleClickPage} style={{'marginTop': '1.5rem'}}>START</button>
    </div>
    </>
  )
}

function HeaderGame({gameParameters}){
  let contentDiv;
  function setContent() {
    if (gameParameters.colors == 7) {
        contentDiv = <div className='bubble rose'></div>
        return   
    }
    if (gameParameters.colors == 8) {
      contentDiv = <><div className='bubble rose'></div><div className='bubble orange'></div></>
      return   
  }
  }
  setContent();

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
          {contentDiv}
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
  for(let i=0; i < input.length; i++) {
    let checker = 0;
    for (let j=0;j<input[0].length; j++) {
      if(input[i][j]['color'] != null) {
        checker++;
      }
      if (j == (input[0].length - 1) && checker != input[0].length && rowChecker==true) {
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
      if (j == (input[0].length - 1) && checker == input[0].length) {
        rowChecker = true;
      }
      if (i == (input.length - 1) && j == (input[0].length - 1) && checker == input[0].length) {
        input.forEach(row => {
          row.forEach(element => {
            element.active = null;
          });
        });
      }
    }
    }
  return input;
}

function activeChecker(input) {
  for(let i=0; i < input.length; i++) {
    for (let j=0;j<input[0].length; j++) {
      if (input[i][j].active != null) {
        return i
      }
  }}
  return input.length;
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

function ClickableBubble({gameParameters, bubbleProperties, setGameBubbles, gameBubbles, computerBubbles, setComputerBubbles, setPage, setIsGameWon}) {

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
    }
    // Check if won
    const allSameColor = activeRow.every(obj => obj.color === "white");
    if (allSameColor) {
      setIsGameWon({'status': true, "message": "Congratulations!"});
    } else if (activeNew == gameBubbles.length) {
      setIsGameWon({'status': true, "message": "Almost there!"});
    }
  }
  
  return(
    <>
    <div className={`bubble ${bubbleProperties['color']}`} onClick={changeColor}></div>
    
    </>   
  )
}

function ModifBubble({ gameParameters, setIsGameWon, bubbleProperties, setGameBubbles, gameBubbles, computerBubbles, setComputerBubbles, setPage }) {

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  function closePopover() {
    setOpen(false);
  }

  function setContentPopover() {
    let listContent = [];
    const listColors = optionsSelection;
    for (let i=0; i<listColors.length; i++) {
      listContent.push({'color': listColors[i], 'index': bubbleProperties['index'], 'active': bubbleProperties['active']})
    }
    return (<div className='flexer gap' onClick={closePopover}>
      {listContent.map((bubble, index) => (
        <>
        <ClickableBubble gameParameters={gameParameters} setIsGameWon={setIsGameWon} bubbleProperties={bubble} setGameBubbles={setGameBubbles} gameBubbles={gameBubbles} computerBubbles={computerBubbles} setComputerBubbles={setComputerBubbles} setPage={setPage}/>
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

function GamePage({ setPage, setIsGameWon, gameParameters }) {
  function handleClickPage(){
    setPage('start');
  }

  let stateBubbles = () => {
    let bubbleTable = [];
    for (let i=0; i < gameParameters.tries; i++) {
      let bubbles = [];
      let isActive = null;
      if(i == 0){
        isActive = 'active-bubble';
      }
      for (let j=0; j<gameParameters.pick; j++) {
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
      <HeaderGame gameParameters={gameParameters}></HeaderGame>
      <ComputerMind winningCombination={winningCombination}/>

      <div id="game-table" className='flexer flexer-column centered'>
      <table style={{width: '100%', maxWidth: "400px"}}>
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
            <ModifBubble gameParameters={gameParameters} setIsGameWon={setIsGameWon} setPage={setPage} bubbleProperties={bubble} setGameBubbles={setGameBubbles} gameBubbles={gameBubbles} computerBubbles={computerBubbles} setComputerBubbles={setComputerBubbles}/>
        ))
        }
        </div>
        
      </td>
      <td key={indexItem+200}>
        <div className='flexer centered' style={{gap :'.25rem'}}>
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

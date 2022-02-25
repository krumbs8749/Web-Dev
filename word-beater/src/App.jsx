

import { useEffect, useState } from 'react';
import './App.scss';

function App() {

  const level = {
    easy: 5,
    medium: 3,
    hard: 1
  }


  const [list, setList] = useState([])
  const [time, setTime] = useState(5);
  const [word, setWord] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [currentLevel, setCurrentLevel] = useState(level.medium);
  const [highestScore, setHighestScore] = useState(() => JSON.parse(localStorage.getItem("highestScore")) || 0);

  
  useEffect(() => {
    const getWordList = async () => {
      const ref = await fetch("https://random-word-api.herokuapp.com/all");
      const data = await ref.json();
      setList(data)
    }
    getWordList();
  },[])

  // occur every rerender
  useEffect(() => {
    newWord();
    setInterval(() => {

      setTime(time =>{ 
        if(time > 0) {
          return time -1;
        }else if(time === 0){
          return 0;
        }
      });
    }, 1000);
    
  },[list])

  

  // updating the highest score to the local storage
  useEffect (()=> {
      localStorage.setItem("highestScore", JSON.stringify(highestScore));
  },[highestScore])

  // executions after game over
  useEffect(() => {
    console.log("k")
    if(time === 0){
      setMessage("Game over!!!");
      setHighestScore(prev => score > highestScore ? score : prev);
      setScore(-1)
    }
    
  },[time, currentLevel])

  // function to pick a new word
  const newWord = () =>{
    const randomIndex = Math.floor(Math.random() * list.length);
    setWord(list[randomIndex]);
  }

  // fired after the input is submitted
  const startMatch = event => {
    event.preventDefault();
    
    if(answer === word) {
      setMessage("Correct!!")
      setScore(score => score + 1)
      setTime(currentLevel + 1);
      newWord();
    }
    setAnswer("")
  }

  // updating the input value continuosly
  const inputChanged = event => {
    event.preventDefault();
    setAnswer(event.target.value)
    
  }

  const selectDifficulty = event => {
    console.log(event.target.value);
    setCurrentLevel(level[event.target.value]);
    
  }
  
  

 

  return (
    <div  className="App">
      
      <div className="topbar">
        <h2>WordBeater</h2>
      </div>

      <div className="main">
        <p>Type the Given Word within <span>{currentLevel}</span> seconds</p>

        <div className="word">
          <h1>{word}</h1>
        </div>

        <form className="answer" onSubmit={e => startMatch(e)}>
          <input 
            type="text" 
            name="answer" 
            placeholder='Start typing...' 
            autoFocus 
            value={answer}
            onChange={inputChanged}
          />
          <input type="submit" value="Submit"  />
        </form>

        <div className='difficulty'>
          <button className={'level ' + (currentLevel === 5 && "active")} value="easy" onClick={selectDifficulty}>Easy</button>
          <button className={'level ' + (currentLevel === 3 && "active")} value="medium" onClick={selectDifficulty}>Medium</button>
          <button className={'level ' + (currentLevel === 1 && "active")} value="hard" onClick={selectDifficulty}>Hard</button>
        </div>
        
        <h6 className="message">{message}</h6>
        

        <div className="status">
          <h5>Time Left: <span>{time}</span></h5>
          <h5>Score: <span>{score >= 0 ? score : 0}</span></h5>
          <h5>Highest Score: <span>{highestScore}</span></h5>
        </div>

        <div className="instructions">
          <h6>Instructions</h6>
          <p>Type each word in the given amount of seconds to score. To play again, just type the current word. Your score will reset.</p>
        </div>
      </div>
      
      
    </div>
  );
}

export default App;

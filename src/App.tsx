import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import { FaChartLine, FaQuestion } from 'react-icons/fa';
import readCsvFile from "./CSVReader";
import readAndParseCsvFile from "./CSVReader";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {Autocomplete, FormControlLabel, Switch, TextField} from "@mui/material";
import Statistics from "./Statistics";
import AboutModal from "./AboutModal";
import Answer from './Answer';
const Modal = require('react-modal');
const seedrandom = require('seedrandom');

function App() {
  const [languages, setLanguages] = useState<any[]>([{name: '<>', sample_text: '<>'}]);
  const [validLangIndexes, setValidLangIndexes] = useState<Set<number>>(new Set())
  const [answerIndex, setAnswerIndex] = useState<number>(0)
  const [guesses, setGuesses] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gotContinent, setGotContinent] = useState<boolean>(false)
  const [gotFamily, setGotFamily] = useState<boolean>(false)
  const [gotLanguage, setGotLanguage] = useState<boolean>(false);
  const [sortingField, setSortingField] = useState<'continent'|'top_level_family'>('continent')
  const [showAnimation, setShowAnimation] = useState(false);
  const [incrementedAmount, setIncrementedAmount] = useState(0);
  const [statisticsIsOpen, setStatisticsIsOpen] = useState(false);
  const [aboutIsOpen, setAboutIsOpen] = useState(false)
  const [answerIsOpen, setAnswerIsOpen] = useState(false)
  const hasPageBeenRendered = useRef(false);
  const gameOver = gotLanguage || guesses.length >= 5;

  //Load save state
  const loadSaveState = (languages: any[], answerIx: number) => {
    const date = (new Date()).toDateString();
    const saveState = localStorage.getItem('save-state'+date);
    if (saveState) {
      const saveStateParsed = JSON.parse(saveState);
      setGuesses(saveStateParsed.guesses);
      setScore(saveStateParsed.score);
      setGotContinent(saveStateParsed.gotContinent);
      setGotFamily(saveStateParsed.gotFamily);
      setGotLanguage(saveStateParsed.gotLanguage)
      setValidLangIndexes(calculateValidLangIndexes(
          createNumberSet(languages.length),
          saveStateParsed.guesses,
          saveStateParsed.gotContinent,
          saveStateParsed.gotFamily,
          languages[answerIx]
      ))
    }
  }

  //Save state
  useEffect(() => {
    if (hasPageBeenRendered.current) {
      const saveState = {
        'guesses': guesses,
        'score': score,
        'gotContinent': gotContinent,
        'gotFamily': gotFamily,
        'gotLanguage': gotLanguage
      }
      const date = (new Date()).toDateString();
      localStorage.setItem('save-state'+date, JSON.stringify(saveState));
    }
  }, [guesses, score, gotContinent, gotFamily, gotLanguage]);

  const openStatistics = () => {
    setStatisticsIsOpen(true);
  };

  const closeStatistics = () => {
    setStatisticsIsOpen(false);
  };

  const openAbout = () => {
    setAboutIsOpen(true);
  }

  const closeAbout = () => {
    setAboutIsOpen(false);
  }

  const closeAnswer = () => {
    setAnswerIsOpen(false);
  }

  useEffect(() => {
    if (gameOver) {
      const info = `${score}:${languages[answerIndex].name}`
      const date = (new Date()).toDateString();
      localStorage.setItem("game:" + date, info);
      setAnswerIsOpen(true);
    }
  }, [gotLanguage, guesses]);

  useEffect(() => {
    readAndParseCsvFile('./world_languages3.csv').then(r => {
      setLanguages(r);
      const answerIx = getRandomInt(0, r.length);
      setAnswerIndex(answerIx)
      setValidLangIndexes(createNumberSet(r.length))
      loadSaveState(r, answerIx);
      hasPageBeenRendered.current = true;
      if (gameOver) {
        setAnswerIsOpen(true);
      }
    })
  }, []);

  useEffect(() => {
    if (score === 0) {
      return;
    }
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
  }, [score]);

  function createNumberSet(n: number): Set<number> {
    let numberSet: Set<number> = new Set();
    for (let i = 0; i < n; i++) {
      numberSet.add(i);
    }
    return numberSet;
  }

  const makeGuess = (guess: any) => {
    if (!guess) {
      return;
    }
    const newGuesses = [...guesses];
    newGuesses.push(guess)
    setGuesses(newGuesses);

    const answer = languages[answerIndex];
    const guessedContinent = guess.continent === answer.continent;
    const guessedFamily = guess.top_level_family === answer.top_level_family;
    let newValidLangIndexes = calculateValidLangIndexes(validLangIndexes, [guess], guessedContinent, guessedFamily, answer )
    setValidLangIndexes(newValidLangIndexes);

    //Calculate Score
    let continentBonus: number = 0;
    let familyBonus: number = 0;
    let languageBonus: number = 0;
    if (guessedContinent && !gotContinent) {
      continentBonus = 5 - newGuesses.length + 1;
      setGotContinent(true);
    }
    if (guessedFamily && !gotFamily) {
      familyBonus = 5 - newGuesses.length + 1;
      setGotFamily(true);
    }
    if (guess === languages[answerIndex]) {
      languageBonus = 5 - newGuesses.length + 1;
      setGotLanguage(true);
    }
    const bonus = continentBonus + familyBonus + languageBonus
    if (bonus > 0) {
      setIncrementedAmount(bonus);
      setScore((prev) => prev + bonus)
    }
  }

  const calculateValidLangIndexes = (prevIndexes: Set<number>, guesses: any[], guessedContinent: boolean, guessedFamily: boolean, answer: any) => {
    const newValidLangIndexes = new Set(prevIndexes)
    languages.forEach((language, index) => {
      if (!validLangIndexes.has(index)) {
        return;
      }
      guesses.forEach(guess => {
        if ((guess.continent === language.continent && !guessedContinent) ||
            (guessedContinent && language.continent !== answer.continent) ||
            (guess.top_level_family === language.top_level_family && !guessedFamily) ||
            (guessedFamily && language.top_level_family !== answer.top_level_family) ||
            language === guess) {
          newValidLangIndexes.delete(index);
        }
      })
    })
    return newValidLangIndexes;
  }

  return (
      <div className="App">
        <header className="App-header">
          <div className="left-container">
            <span className="logo">Polyglottle</span>
          </div>
          <div className="right-container">
            <FaChartLine className="icon" onClick={openStatistics}/>
            <FaQuestion className="icon" onClick={openAbout}/>
          </div>
        </header>

        <h3>{(gotLanguage || guesses.length === 5) ? languages[answerIndex].name : "What language is this?"} </h3>
        <div className={'guessing-box'}>
          <Autocomplete
              id="grouped-demo"
              options={languages.filter((language, index) => validLangIndexes.has(index) && language.name).sort((a, b) => a[sortingField].localeCompare(b[sortingField]))}
              groupBy={(option) => option[sortingField]}
              style={{backgroundColor: "white", borderRadius: "5px"}}
              getOptionLabel={(option) => option.name}
              sx={{width: '70%', maxWidth: 300}}
              blurOnSelect={true}
              renderInput={(params) => <TextField {...params}/>}
              onChange={(event, value) => makeGuess(value)}
              disabled={gameOver}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'flip',
                      enabled: true
                    },
                    {
                      name: 'preventOverflow',
                      enabled: true
                    }
                  ]
                }
              }}
          />
          <p style={{marginLeft: '10px', marginRight: '10px'}}>{`Guess ${guesses.length}/5`}</p>
        </div>
        <FormControlLabel
            control={
              <Switch
                  checked={sortingField === 'continent'}
                  onChange={() => {
                    setSortingField(sortingField === 'continent' ? 'top_level_family' : 'continent')
                  }}
                  inputProps={{'aria-label': 'controlled'}}
              />
            }
            label={sortingField === 'continent' ? 'Sort by Continent' : 'Sort by Language Family'}
        />
        <h4 style={{margin: 0, color: 'lightgreen'}}>{`Score: ${score}/15`}</h4>

        <LanguageInfo sampleText={languages[answerIndex].sample_text} guesses={guesses}
                      answer={languages[answerIndex]}/>
        {showAnimation && <div className="plusAnimation">+{incrementedAmount}</div>}
        <Modal
            className="modal"
            isOpen={statisticsIsOpen}
            onRequestClose={closeStatistics}
        >
          <CloseIcon onClick={closeStatistics}/>
          <Statistics/>
        </Modal>
        <Modal
            className="modal"
            isOpen={aboutIsOpen}
            onRequestClose={closeAbout}
        >
          <CloseIcon onClick={closeAbout}/>
          <AboutModal/>
        </Modal>
        <Modal
          className="modal"
          isOpen={answerIsOpen}
          onRequestClose={closeAnswer}
        >
          <CloseIcon onClick={closeAnswer}/>
          <Answer language={languages[answerIndex]} guesses={guesses} gotLanguage={gotLanguage}/>
        </Modal>
      </div>
  );
}

//Generate a random number using the local date as the seed. That way, the app will generate a new answer each day.
function getRandomInt(min: number, max: number) {
  const date = new Date();
  const seed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  const rng = seedrandom(seed);
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const LanguageInfo = (props: { sampleText: string, guesses: any[], answer: any }) => {
  let guessedLanguages: Set<string> = new Set()
  let guessedContinents: Set<string> = new Set();
  let guessedFamilies: Set<string> = new Set();

  props.guesses.forEach((guess) => {
    guessedLanguages.add(guess.name);
    guessedContinents.add(guess.continent);
    guessedFamilies.add(guess.top_level_family);
  })

  const getGuessesToDisplay = (guesses: Set<string>, answer: string) => {
    if (guesses.has(answer)) {
      return (<Guess isCorrect={true} label={answer}/>);
    } else {
      return Array.from(guesses).map(guess => (
          <Guess isCorrect={false} label={guess}/>
      ));
    }
  }

  return (
      <div className="language-info">
        <div className="left-section">
          <div className="section">
            <div className="label">Language</div>
            <div className="guess-container">
              {getGuessesToDisplay(guessedLanguages, props.answer.name)}
            </div>
          </div>
          <div className="divider"></div>
          <div className="section">
            <div className="label">Continent</div>
            <div className="guess-container">
              {getGuessesToDisplay(guessedContinents, props.answer.continent)}
            </div>
          </div>
          <div className="divider"></div>
          <div className="section">
            <div className="label">Language Family</div>
            <div className="guess-container">
              {getGuessesToDisplay(guessedFamilies, props.answer.top_level_family)}
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="big-area">
            <p>{props.sampleText}</p>
          </div>
        </div>
      </div>
  );
}

const Guess = (props: {isCorrect: boolean, label: string}) => {
  const color = props.isCorrect ? 'green' : 'grey';
  return (
      <div className="guess" style={{backgroundColor: color}}>
        <div className="guess-left-section">
          {props.isCorrect ? <CheckIcon/> : <CloseIcon/>}
        </div>
        <div className="guess-right-section">
          <div className="guess-content">
            {props.label}
          </div>
        </div>
      </div>
  );
}

export default App;

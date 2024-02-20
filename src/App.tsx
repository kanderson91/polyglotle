import React, {useEffect, useState} from 'react';
import './App.css';
import readCsvFile from "./CSVReader";
import readAndParseCsvFile from "./CSVReader";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {Autocomplete, FormControlLabel, Switch, TextField} from "@mui/material";
import Statistics from "./Statistics";
const Modal = require('react-modal');

function App() {
  const [languages, setLanguages] = useState<any[]>([{name: '<>', sample_text: '<>'}]);
  const [validLangIndexes, setValidLangIndexes] = useState<Set<number>>(new Set())
  const [answerIndex, setanswerIndex] = useState<number>(0)
  const [guesses, setGuesses] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gotContinent, setGotContinent] = useState<boolean>(false)
  const [gotFamily, setGotFamily] = useState<boolean>(false)
  const [gotLanguage, setGotLanguage] = useState<boolean>(false);
  const [sortByContinent, setSortByContinent] = useState<boolean>(true);
  const [sortingField, setSortingField] = useState<'continent'|'top_level_family'>('continent')
  const [showAnimation, setShowAnimation] = useState(false);
  const [incrementedAmount, setIncrementedAmount] = useState(0);
  const [statisticsIsOpen, setStatisticsIsOpen] = useState(false);

  const openStatistics = () => {
    setStatisticsIsOpen(true);
  };

  const closeStatistics = () => {
    setStatisticsIsOpen(false);
  };

  useEffect(() => {
    if (gotLanguage || guesses.length >= 5) {
      const info = `${score}:${languages[answerIndex].name}`
      //TODO construct this out of day month year so that if the format changes it doesn't matter.
      const date = (new Date()).toDateString();
      localStorage.setItem("game:" + date, info);
    }
  }, [gotLanguage, guesses]);

  useEffect(() => {
    readAndParseCsvFile('./world_languages2.csv').then(r => {
      setLanguages(r);
      setValidLangIndexes(createNumberSet(r.length))
    })
  }, []);

  useEffect(() => {
    if (score === 0) {
      return;
    }
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000); // Adjust the duration of the animation as needed
  }, [score]);

  useEffect(() => {
    if (languages) {
      setanswerIndex(getRandomInt(0, languages.length))
    }
  }, [languages]);

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

    let newValidLangIndexes = new Set(validLangIndexes);

    const answer = languages[answerIndex];
    const guessedContinent = guess.continent === answer.continent;
    const guessedFamily = guess.top_level_family === answer.top_level_family;
    languages.forEach((language, index) => {
      if (!validLangIndexes.has(index)) {
        return;
      }
      if ((guess.continent === language.continent && !guessedContinent) ||
          (guessedContinent && language.continent !== answer.continent) ||
          (guess.top_level_family === language.top_level_family && !guessedFamily) ||
          (guessedFamily && language.top_level_family !== answer.top_level_family) ||
          language === guess) {
        newValidLangIndexes.delete(index);
      }
    })
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
      languageBonus = 5;
      setGotLanguage(true);
    }
    const bonus = continentBonus + familyBonus + languageBonus
    if (bonus > 0) {
      setIncrementedAmount(bonus);
      setScore((prev) => prev + bonus)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{(gotLanguage || guesses.length === 5) ? languages[answerIndex].name : "What language is this?"} </p>
        <p>{`Guesses: ${guesses.length}/5`}</p>
        {showAnimation && <div className="plusAnimation">+{incrementedAmount}</div>}
        <p>{`Score: ${score}/15`}</p>
        <Autocomplete
            id="grouped-demo"
            options={languages.filter((guess, index) => validLangIndexes.has(index)).sort((a, b) => a[sortingField].localeCompare(b[sortingField]))}
            groupBy={(option) => option[sortingField]}
            style={{backgroundColor: "white", borderRadius: "5px"}}
            getOptionLabel={(option) => option.name}
            sx={{width: 300}}
            blurOnSelect={true}
            renderInput={(params) => <TextField {...params} label="Select a language"/>}
            onChange={(event, value) => makeGuess(value)}
        />
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
        <LanguageInfo sampleText={languages[answerIndex].sample_text} guesses={guesses}
                      answer={languages[answerIndex]}/>
        <button onClick={openStatistics}>Statistics</button>
        <Modal
            className="statistics-modal"
            isOpen={statisticsIsOpen}
            onRequestClose={closeStatistics}
        >
          <Statistics />
          <button onClick={closeStatistics}>Close Modal</button>
        </Modal>
      </header>
    </div>
  );
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return 0;
  //return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const LanguageInfo = (props: {sampleText: string, guesses: any[], answer: any}) => {
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
      <div className="container">
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

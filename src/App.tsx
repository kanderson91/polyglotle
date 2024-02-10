import React, {useEffect, useState} from 'react';
import './App.css';
import readCsvFile from "./CSVReader";
import readAndParseCsvFile from "./CSVReader";

function App() {
  const [languages, setLanguages] = useState<any[]>([{name: '<>', sample_text: '<>'}]);
  const [validLangIndexes, setValidLangIndexes] = useState<Set<number>>(new Set())
  const [answerIndex, setanswerIndex] = useState<number>(0)
  const [guesses, setGuesses] = useState<any[]>([]);
  const [guessedAnswer, setGuessedAnswer] = useState<boolean>(false);

  useEffect(() => {
    readAndParseCsvFile('./world_languages.csv').then(r => {
      setLanguages(r);
      setValidLangIndexes(createNumberSet(r.length))
    })
  }, []);

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

  const makeGuess = (guessIndex: string) => {
    const guess = languages[parseInt(guessIndex)];
    const newGuesses = [...guesses];
    newGuesses.push(guess)
    setGuesses(newGuesses);

    if (parseInt(guessIndex) === answerIndex) {
      setGuessedAnswer(true);
    }

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
          (guessedFamily && language.top_level_family !== answer.top_level_family)) {
        newValidLangIndexes.delete(index);
      }
    })
    setValidLangIndexes(newValidLangIndexes);

  }

  const displayLang = (index: number): string => {
    if (validLangIndexes.has(index)) {
      return '';
    } else {
      return 'none';
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{(guessedAnswer || guesses.length === 5) ? languages[answerIndex].name : "What language is this?"} </p>
        <p>{`Guesses: ${guesses.length}/5`}</p>
        <p>
          {languages[answerIndex].sample_text}
        </p>
        <select onChange={(e) => makeGuess(e.target.value)}>
          {languages.map((language, index) => (
              <option key={index} value={index} style={{ display:  displayLang(index)} }>
                {language.name}
              </option>
          ))}
        </select>
        <GuessDisplay guesses={guesses} answer={languages[answerIndex]} />

      </header>
    </div>
  );
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const GuessDisplay = (props: {guesses: any[], answer: any}) => {
  let guessedLanguages: Set<string> = new Set()
  let guessedContinents: Set<string> = new Set();
  let guessedFamilies: Set<string> = new Set();

  props.guesses.forEach((guess) => {
    guessedLanguages.add(guess.name);
    guessedContinents.add(guess.continent);
    guessedFamilies.add(guess.top_level_family);
  })

  const getDisplayString = (values: Set<string>, answer: string) => {
    return values.size === 0 ? "" : values.has(answer) ? answer : `NOT ${Array.from(values).join(', ')}`;
  }

  return (
      <div>
        <p>{`Language: ${getDisplayString(guessedLanguages, props.answer.name)}`}</p>
        <p>{`Continent: ${getDisplayString(guessedContinents, props.answer.continent)}`}</p>
        <p>{`Language Family: ${getDisplayString(guessedFamilies, props.answer.top_level_family)}`}</p>

      </div>
  )
}

export default App;

import { useEffect, useState } from "react";
import Statistics from "./Statistics";
import './Answer.css';
import { Button } from "@mui/material";

const continentEmoji = '🌍'
const languageEmoji = '💬'
const familyEmoji = '👪'
const correctSquare = '🟩'
const incorrectSquare = '⬛'

function Answer(props: {language: any, guesses: any[], gotLanguage: boolean, score: number}) {

    const [wikipediaPreview, setWikipediaPreview] = useState<string>('')
    const [wikipediaLink, setWikipediaLink] = useState<string>('')

    const getEmojiResults = () => {
        let result = `Score: ${props.score}/15\n ${languageEmoji}${continentEmoji}${familyEmoji}\n`
        for (let guess of props.guesses) {
            let line = '';
            if (guess.name === props.language.name) {
                line += correctSquare;
            } else {
                line += incorrectSquare;
            }
            if (guess.continent === props.language.continent) {
                line += correctSquare;
            } else {
                line += incorrectSquare;
            }
            if (guess.top_level_family === props.language.top_level_family) {
                line += correctSquare;
            } else {
                line += incorrectSquare;
            }
            line += '\n'
            result += line;
        }
        return result;
    }

    const copyResults = () => {
        navigator.clipboard.writeText(getEmojiResults());
    }

    useEffect(() => {
        const fetchWikipediaContent = async () => {
            try {
                const response = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(props.language.wikipedia_link)}`
                );
                const data = await response.json();
                console.log(data)

                if (data.extract) {
                    // Extract the first paragraph
                    const firstParagraph = data.extract.split('\n')[0];
                    setWikipediaPreview(firstParagraph);
                    if (!wikipediaLink) {
                        setWikipediaLink(data.content_urls.desktop.page);
                    }
                } else {
                    setWikipediaPreview('No content found');
                }
            } catch (error) {
                setWikipediaPreview('Error fetching data');
            }
        };

        fetchWikipediaContent();
    }, []);

    return (
        <div className={'answer-modal'}>
            {props.gotLanguage && <h1>You got it!</h1>}
            <h1>The answer was {props.language.name}</h1>
            {wikipediaPreview && wikipediaLink && <div className={'wikipedia-preview'}>
                <p>{wikipediaPreview}</p>
                <a href={wikipediaLink} target={"_blank"}>Wikipedia</a>
            </div>}
            <button onClick={copyResults}>Copy Results</button><br/>
            <span className={'emoji-results'}>{getEmojiResults()}</span>
            <Statistics/>
        </div>
    )
}

export default Answer;
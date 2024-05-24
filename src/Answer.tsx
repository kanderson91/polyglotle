import { useEffect, useState } from "react";
import Statistics from "./Statistics";

const continentEmoji = '🌍'
const languageEmoji = '💬'
const familyEmoji = '👪'
const correctSquare = '🟩'
const incorrectSquare = '⬛'

function Answer(props: {language: any, guesses: any[]}) {

    const [paragraph, setParagraph] = useState<string>('')

    const getEmojiResults = () => {
        let result = `${languageEmoji}${continentEmoji}${familyEmoji}\n`
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

    useEffect(() => {
        const fetchWikipediaContent = async () => {
            try {
                const response = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(props.language.name)}_language`
                );
                const data = await response.json();

                if (data.extract) {
                    // Extract the first paragraph
                    const firstParagraph = data.extract.split('\n')[0];
                    setParagraph(firstParagraph);
                } else {
                    setParagraph('No content found');
                }
            } catch (error) {
                setParagraph('Error fetching data');
            }
        };

        fetchWikipediaContent();
    }, []);

    return (
        <div>
            <p>The answer was {props.language.name}</p>
            <p>{paragraph}</p>
            <span style={{ whiteSpace: 'pre-line', fontSize: '20pt' }}>{getEmojiResults()}</span>
            <Statistics/>
        </div>
    )
}

export default Answer;
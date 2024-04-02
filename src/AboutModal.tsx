
function AboutModal() {
    return (
        <div>
            <h2>How to Play</h2>
            <li>
                Each day you'll see a sample of text from one of the world languages.
                You have five guesses to figure out what language it is.
            </li>
            <li>
                If your guess is wrong, the game will tell you whether or not you're in
                the right continent or language family. The options for future guesses
                are filtered down based on that information.
            </li>
            <li>
                Scoring is as follows:
                <ul>
                    <li>+5 points for guessing the correct language (at any point)</li>
                    <li>
                        +5 points for guessing anything from the correct continent on the
                        first guess (+4 on the second guess, +3 on the third, etc.)
                    </li>
                    <li>
                        +5 points for guessing anything from the correct language family on
                        the first guess (+4 on the second guess, +3 on the third, etc.)
                    </li>
                </ul>
            </li>
        </div>
    );
}

export default AboutModal

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
                    <li>+5 points for guessing the correct language on the
                        first guess (+4 on the second guess, +3 on the third, etc.)
                    </li>
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
            <h2>FAQs</h2>
                <h3>What do the sample texts say?</h3>
                <p>Right now, all the sample texts are translations of the first article of the <a href={"https://www.ohchr.org/en/human-rights/universal-declaration/universal-declaration-human-rights/about-universal-declaration-human-rights-translation-project"} target={"_blank"}>Universal Declaration of Human Rights</a>: "All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood."
                This has been translated into over 500 languages and is the most translated document in the World according to the <a href={"https://www.guinnessworldrecords.com/world-records/most-translated-document"} target={"_blank"}>Guiness Book of World Records</a>. So it seemed like a good place to start for this game. Thanks to everyone at the <a href={"http://efele.net/udhr/"} target={"_blank"}>UDHR in XML Project</a> for hosting all these translations in an easily accessible format. All the sample texts for this game were taken from there.</p>
                <h3>How did you decide what languages to include as options?</h3>
                <p>
                    I tried to strike a balance between representing languages from around the world and not making the game too hard. So I included languages based on these criteria (out of the 500+ languages that I have sample texts for):
                </p>
                <ul>
                    <li>Any language with more than one milllion speakers is included.</li>
                    <li>If a language family doesn't have any languages with more than a million speakers, I included the most spoken language in that family. This let me keep a sampling of languages from North and South America that would otherwise have been excluded.</li>
                </ul>
            <h2>Contact</h2>
                <p>Source code on <a href={"https://github.com/kanderson91/polyglotle"} target={"_blank"}>github</a></p>
        </div>
    );
}

export default AboutModal
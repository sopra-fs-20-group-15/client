import React from 'react';
import styled from 'styled-components';
import {api, handleError} from '../../helpers/api';
import {withRouter} from 'react-router-dom';
import Timer from "../timer/Timer";
import {ActiveCardContainer, ChooseWord, Deck, GuessedCards, Number, Word} from "../../views/design/InGame/CardsUI";
import {
    BoardContainer,
    EndGameContainer,
    Game,
    GameOver,
    HUDContainer,
    Statistics,
    StatisticsContainer,
    Table,
    TableContainer,
    Waiting
} from "../../views/design/InGame/InGameUI";
import {Phase, PhaseCircle, PhaseMessage} from "../../views/design/InGame/PhaseUI";
import {
    GuessedCardsField,
    Input,
    InputFieldPlayer,
    NameField,
    NameFieldActivePlayer,
    Output,
    Player,
    PlayerContainer,
    ScoreField,
    SignalFieldPlayer
} from "../../views/design/InGame/PlayerUI";
import {LogoutButton} from "../../views/design/Button";
import ClickIcon from '../../views/pictures/ClickIcon.png'
import MuteIcon from '../../views/pictures/MuteIcon.png';
import SoundIcon from '../../views/pictures/SoundIcon.png';
import PlayerComponent from "../../views/PlayerComponent";
import EasterEggs from "../../views/EasterEggs";
import PhaseMessageComponent from "../../roundMessage/PhaseMessageComponent";


const SoundButton = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  bottom: 1.5%;
  left: 1%;
`;

const LeaveGameButtonContainer = styled.div`
  position: absolute;
  bottom: 40px;
  right: 50px;
  justify-content: center;
`;

/** Changes position of an element in an array
 * @param: string[]
 * @param: int
 * @param: int
 * @return: string[] */
function array_move(array, oldIndex, newIndex) {
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
}


class InGame extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor(props) {
        super(props);
        this.state = {
            soundOn: true,
            disableSoundButton: false,
            gameId: null,
            currentCard: [],
            mysteryWordId: null,
            mysteryWord: "",
            players: [],
            clonePlayers: [],
            activePlayer: null,
            passivePlayers: [],
            passivePlayersCluesGiven: [],
            clues: [],
            guess: "",
            validGuess: false,
            timer: 30,
            remainingCards: 13,
            guessedCards: [0, 0, 0, 0, 0, 0, 0],
            scores: [0, 0, 0, 0, 0, 0, 0],
            round: 1,
            phaseNumber: 1,
            phases: ["1. Choose Number", "2. Write Clues", "3. Guess Word", "4. Word Reveal"],
            nextTimer:[30, 50, 60, 10],
            pageRefreshed: true,
            player1Input: null,
            player2Input: null,
            player3Input: null,
            player4Input: null,
            player5Input: null,
            player6Input: null,
            player7Input: null,
            clue1: null,
            clue2: null,
            clue3: null,
            clue4: null,
            clue5: null,
            clue6: null,
            clue7: null,
            gameHasEnded: false,
            highestScore: [],
            mostGuesses: [],
            leastGuesses: [],
            deleted: false
        };

        this.interval = setInterval(this.handlePolling, 750);
        this.intervalIsStillAlive = setInterval(this.isStillAlive, 2000);
        this.handlePolling = this.handlePolling.bind(this);
        this.determineMysteryWord = this.determineMysteryWord.bind(this);
        this.giveClue = this.giveClue.bind(this);
        this.setGuess = this.setGuess.bind(this);
        this.gameHasEnded = this.gameHasEnded.bind(this);
        this.initializeTurn = this.initializeTurn.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
    }

    /** Request that is used by backend to ensure that a player is still an active participant in the game */
    isStillAlive = async () => {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token')
            });

            await api.put('/games/' + this.props.match.params.id + '/phases', requestBody);

        } catch (error) {
            console.log("Error in isStillAlive()", handleError(error));
        }
    };

    /** Used to synchronize the phase number and timer upon refreshing the page */
    async getPhase() {
        try {

            const response = await api.get('/games/' + this.props.match.params.id + '/phases');

            if (response.status === 200) {
                this.setState({
                    phaseNumber: response.data.phaseNumber
                });
                this.setState({
                    timer: this.getRemainingTime(response.data.timeStart)
                });
            }
            this.updatePhaseHUD(this.state.phaseNumber);
            
        } catch(error) {
            console.log('Error in getPhase()', handleError(error))
        }
    }

    /** Converts timestamp received from backend to remaining seconds of timer */
    getRemainingTime(startTime) {
        let d = new Date();
        let newTime = d.getTime();
        let goneMSeconds = (newTime - startTime)%1000;
        let goneSeconds = ((newTime - startTime) - goneMSeconds)/1000; //
        return this.state.nextTimer[this.state.phaseNumber - 1] - goneSeconds;
    }

    /** Called upon starting a new round in order to reset all the variables in the backend (like the mystery word, clues etc.) */
    async initializeTurn() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token')
            });

            await api.put('/games/' + this.state.gameId + '/initializations', requestBody);

        } catch (error) {
            console.log('Error in initializeTurn()', handleError(error))
        }
    }

    /** Called at the end of each round in order to check whether a new round has to start or the game should be finished */
    async gameHasEnded() {
        try {
            if (!this.state.gameHasEnded) {
                const response = await api.get('/games/' + this.state.gameId + '/ends/' + localStorage.getItem('token'));
                this.setState({
                    gameHasEnded: response.data.hasGameEnded
                });
            }

            if (this.state.gameHasEnded) {
                this.getHighestNumberOfGuesses();
                this.getLowestNumberOfGuesses();
                this.getTotalNumberOfGuesses();
                this.getHighestScore();
                this.endgamOverlayOn();
                setTimeout(() => this.deleteGame(), 16000);
                setTimeout(() => localStorage.removeItem('GameGuard'), 16000);
            } else {
                this.resetMysteryWord();
                this.resetMysteryWordId();
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    this.initializeTurn();
                }
            }

        } catch (error) {
            this.props.history.push('/lobbyOverview');
            alert(`Something went wrong while checking whether the game has ended!`);
            console.log('Error in gameHasEnded()', handleError(error))
        }
    }

    /** Deletes the active game in the backend after ending it */
    async deleteGame() {
        try {
            if (localStorage.getItem('username') === this.state.activePlayer && !this.state.deleted) {
                this.setState({
                    deleted: true
                });
                //this.deleteGameSetUp();
                await api.delete('/activeGames/' + this.state.gameId);
                this.props.history.push('/lobbyOverview');
            }

            if (!this.state.deleted) {
                this.setState({
                    deleted: true
                });
                this.props.history.push('/lobbyOverview');
            }

        } catch (error) {
            if (error.response.status !== 404) {
                console.log('Error in deleteGame()', handleError(error))
            }
        }
    }

    /** Deletes the gameSetUp -> called five seconds after starting the game in order to make sure that the lobby will not
     * be visible from the lobby overview anymore */
    async deleteGameSetUp() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token')
            });

            const response = await api.delete('/gameSetUps/' + localStorage.getItem('gameSetUpId'), {data: requestBody});
            localStorage.removeItem('gameSetUpId');

            console.log('response form delete setup', response);

        } catch (error) {
            if (error.response.status !== 404) {
                console.log('Error in deleteGameSetUp()', handleError(error))
            }
        }
    }

    /** Fetches a card (=array of five words) from the backend */
    async getCard() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/cards/' + localStorage.getItem('token'));

            if (response.status === 200 && response.data.words !== this.state.currentCard) {
                this.setState({
                    currentCard: response.data.words
                })
            }

        } catch (error) {
            console.log('Error in getCard', handleError(error))
        }
    }

    /** Is called by the active player in order to determine a mystery word on the card
     * @Param: int wordId (number between 1 and 5) */
    async determineMysteryWord(wordId) {
        try {
            if (localStorage.getItem('username') === this.state.activePlayer) {
                if (this.state.phaseNumber === 1) {
                    const requestBody = JSON.stringify({
                        wordId: wordId,
                        playerToken: localStorage.getItem('token')
                    });

                    this.setState({
                        mysteryWord: this.state.currentCard[wordId - 1],
                        mysteryWordId: wordId
                    });

                    await api.put('/games/' + this.state.gameId + "/mysteryWord", requestBody);

                    this.crossOutWords(wordId);
                }
            }
        } catch (error) {
            console.log('Error in determineMysteryWord()', handleError(error))
        }
    }

    /** Responsible for crossing out all words on the card except for the mystery word */
    async crossOutWords(wordId) {
        for (let i = 0; i < this.state.currentCard.length; i++) {
            if (wordId - 1 !== i) {
                let lineThroughWord = document.getElementById("word" + (i + 1));
                lineThroughWord.style.textDecoration = "line-through";
            }
        }
    }

    /** Responsible for resetting the mystery word in the forth phase of the game */
    async resetMysteryWord() {
            this.setState({
                mysteryWord: "",
            })
    }

    /** Responsible for resetting the mystery word id in the forth phase of the game */
    async resetMysteryWordId() {
            this.setState({
                mysteryWordId: null
            })
    }

    /** Fetches the mystery word from the backend */
    async getMysteryWord() {
        try {
            const response = await api.get('/games/' + this.state.gameId + "/mysteryWord/" + localStorage.getItem('token'));
            if (response.status === 200) {
                this.setState({
                    mysteryWord: response.data.word,
                    mysteryWordId: this.state.currentCard.indexOf(response.data.word) + 1
                });
            }
            //this.determineMysteryWordId();

            if (this.state.mysteryWordId) {
                this.crossOutWords(this.state.mysteryWordId);
            }

            if (this.state.phaseNumber === 4) {
                // this.resetMysteryWord();
                // this.resetMysteryWordId();
            }

        } catch (error) {
            console.log('Error in getMysteryWord', handleError(error));
            if (this.state.phaseNumber == 4) {
                // this.resetMysteryWord();
                // this.resetMysteryWordId();
            }
        }
    }

    /** Makes sure that the crossing out of the word that are not the mystery word is undone at the start of a new round */
    async undoCrossingOut() {
        for (let i = 0; i < this.state.currentCard.length; i++) {
            let lineThroughWord = document.getElementById("word" + (i + 1));
            lineThroughWord.style.textDecoration = "none";
        }
    }

    /** Lets player send a clue to the backend
     * @Param: string clue */
    async giveClue(clue) {
        try {
            if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                if (!this.state.passivePlayersCluesGiven.includes(localStorage.getItem('username'))) {
                    if (clue.trim().split(" ").length === 1) {
                        const requestBody = JSON.stringify({
                            clue: clue,
                            playerToken: localStorage.getItem('token')
                        });

                        await api.post('/games/' + this.state.gameId + "/clues", requestBody);

                    } else {
                        alert('Your clue has to consist of exactly one word!')
                    }
                }
            }
        } catch (error) {
            console.log('Error in giveClue()', handleError(error))
        }
    }

    /** Fetches a list of valid clues from the backend */
    async getValidClues() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/clues/' + localStorage.getItem('token'));

            if (response.status === 200) {
                this.setState({
                    clues: response.data
                });
            }

            this.displayOwnClue();

            this.displayCluesOfOthers();

        } catch (error) {
            console.log('Error in getValidClues', handleError(error))
        }
    }

    /** Responsible for displaying the clue sent by a player himself */
    async displayOwnClue() {
        if (localStorage.getItem('username') !== this.state.activePlayer) {
            for (let i = 0; i < this.state.clues.length; i++) {
                if (this.state.clues[i].playerName === localStorage.getItem('username')) {
                    let output = document.getElementById("clue1");
                    output.textContent = this.state.clues[i].clue;
                    break;
                }
                let output = document.getElementById("clue1");
                output.textContent = "'invalid clue'";
            }
        }
    }

    /** Responsible for displaying clues sent by the other player */
    async displayCluesOfOthers() {
        for (let i = 0; i < this.state.clonePlayers.length; i++) {
            if (this.state.clonePlayers[i] !== this.state.activePlayer) {
                for (let j = 0; j < this.state.clues.length; j++) {
                    if (this.state.clues[j].playerName === this.state.clonePlayers[i]) {
                        let output = document.getElementById("clue" + (i + 2));
                        output.textContent = this.state.clues[j].clue;
                        break;
                    }
                    let output = document.getElementById("clue" + (i + 2));
                    output.textContent = "'invalid clue'";
                }
                if (this.state.clues.length === 0) {
                    for (let i = 0; i < this.state.clonePlayers.length; i++) {
                        if (this.state.clonePlayers[i] !== this.state.activePlayer) {
                            let output = document.getElementById("clue" + (i + 2));
                            output.textContent = "'invalid clue'";
                        }
                    }
                }
            }
        }
    }

    /** Responsible for resetting the display of clues upon starting a new round */
    async undoClueDisplay() {
        for (let i = 0; i < this.state.clonePlayers.length; i++) {
            let output = document.getElementById("clue" + (2 + i));
            output.textContent = "";
        }
    }

    /** Sends a guess to the backend
     * @Param: string guess */
    async setGuess(guess) {
        try {
            if (localStorage.getItem('username') === this.state.activePlayer) {
                const requestBody = JSON.stringify({
                    guess: guess,
                    playerToken: localStorage.getItem('token')
                });

                await api.post('/games/' + this.state.gameId + "/guesses", requestBody);

            }
        } catch (error) {
            console.log('Error in setGuess()', handleError(error))
        }
    }

    /** Fetches the guess from the backend */
    async getGuess() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/guesses/' + localStorage.getItem('token'));

            if (response.status === 200) {
                this.setState({
                    guess: response.data.guess,
                    validGuess: response.data.isValidGuess
                });
            }

            this.displayGuess();

        } catch (error) {
            console.log('Error in getGuess()', handleError(error))
        }
    }

    /** Fetches an array of the scores of the different players from the backend */
    async getScores() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/statistics');

            if (response.status === 200) {

                let scoreList = [0, 0, 0, 0, 0, 0, 0];
                let guessedCardsList = [0, 0, 0, 0, 0, 0, 0];

                for (let i = 0; i < this.state.clonePlayers.length; i++) {
                    for (let k = 0; k < response.data.length; k++) {
                        if (this.state.clonePlayers[i] === response.data[k].playerName) {
                            scoreList[i + 1] = response.data[k].score;
                            guessedCardsList[i + 1] = response.data[k].numberOfCorrectlyGuessedMysteryWords;
                        }
                        if (localStorage.getItem('username') === response.data[k].playerName) {
                            scoreList[0] = response.data[k].score;
                            guessedCardsList[0] = response.data[k].numberOfCorrectlyGuessedMysteryWords;
                        }
                    }
                }
                this.setState({
                    scores: scoreList,
                    guessedCards: guessedCardsList
                });
            }
        } catch (error) {
            if (error.response.status !== 404) {
                console.log('Error in getScores()', handleError(error))
            }
        }
    }

    /** Determines the highest score among all players in the game */
    async getHighestScore() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/statistics');

            if (response.status === 200) {

                let highestScore = response.data[0];

                for (let i = 1; i < response.data.length; i++) {
                    if (response.data[i].score >= highestScore) {
                        highestScore = response.data[i];
                    }
                }
                this.setState({
                    highestScore: highestScore
                });
            }

        } catch (error) {
            if (error.response.status !== 404) {
                console.log('Error in getHighestScore()', handleError(error))
            }
        }
    }

    /** Determines the highest number of guesses among all players in the game */
    async getHighestNumberOfGuesses() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/statistics');

            if (response.status === 200) {

                let mostGuesses = response.data[0];

                for (let i = 1; i < response.data.length; i++) {
                    if (response.data[i].numberOfCorrectlyGuessedMysteryWords >= mostGuesses.numberOfCorrectlyGuessedMysteryWords) {
                        mostGuesses = response.data[i];
                    }
                }
                this.setState({
                    mostGuesses: mostGuesses
                })
            }
        } catch (error) {
            if (error.response.status !== 404) {
                console.log('Error in getHighestNumberOfGuesses()', handleError(error))
            }
        }
    }

    /** Determines the lowest score among all players in the game */
    async getLowestNumberOfGuesses() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/statistics');

            if (response.status === 200) {

                let leastGuesses = response.data[0];

                for (let i = 1; i < response.data.length; i++) {
                    if (response.data[i].numberOfCorrectlyGuessedMysteryWords <= leastGuesses.numberOfCorrectlyGuessedMysteryWords) {
                        leastGuesses = response.data[i];
                    }
                }

                this.setState({
                    leastGuesses: leastGuesses
                });
            }

        } catch (error) {
            if (error.response.status !== 404) {
                console.log('Error in getLowestNumberOfGuesses()', handleError(error))
            }
        }
    }

    /** Determines the total score among all players in the game */
    async getTotalNumberOfGuesses() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/statistics');

            if (response.status === 200) {

                let totalGuesses = 0;

                for (let i = 0; i < response.data.length; i++) {
                    totalGuesses += response.data[i].numberOfCorrectlyGuessedMysteryWords;
                }

                this.setState({
                    totalGuesses: totalGuesses
                });
            }

        } catch (error) {
            if (error.response.status !== 404) {
                console.log('Error in getTotalNumberOfGuesses()', handleError(error))
            }
        }
    }

    /** Fetches the amount of cards left in the game from the backend */
    async getCardAmount() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/cards/remainder/' + localStorage.getItem('token'));
            if (response.status === 200) {
                this.setState({
                    remainingCards: response.data.cardsOnStack
                });
            }

        } catch (error) {
            console.log('Error in getCardAmount()', handleError(error))
        }
    }

    /** Fetches a list of dictionaries mapping the players and their clues together */
    async getCluePlayers() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/clues/players/' + localStorage.getItem('token'));

            if (this.state.phaseNumber !== 4) {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        if (!this.state.passivePlayersCluesGiven.includes(response.data[i].playerName)) {
                            this.signalClueSubmission(response.data[i].playerName);
                            this.setState({
                                passivePlayersCluesGiven: this.state.passivePlayersCluesGiven.concat(response.data[i].playerName)
                            });
                        }
                    }
                }
            } else {
                this.setState({
                    passivePlayersCluesGiven: []
                });
            }
        } catch (error) {
            console.log('Error in getCluePlayers()', handleError(error))
        }
    }

    /** Fetches the list of players from the backend and distributes the role of active and passive player */
    async getPlayers() {
        try {
            const response = await api.get('/activeGames/' + this.props.match.params.id);

            this.setState({
                gameId: this.props.match.params.id,
                players: response.data.playerNames,
                activePlayer: response.data.activePlayerName,
                passivePlayers: response.data.passivePlayerNames
            });


            this.playersWithoutUser(response.data.playerNames).then(result => this.setState({
                clonePlayers: result
            }));

        } catch (error) {
            console.log('Error in getPlayers()', handleError(error))
        }
    }

    /** Lets a player leave a game */
    async leaveGame() {
        try {
            if (this.state.phaseNumber === 4){

                const requestBody = JSON.stringify({
                    playerToken: localStorage.getItem('token')
                });

                const response = await api.put('/activeGames/'+ this.state.gameId + '/players', requestBody);
                if (response.status === 200) {
                    localStorage.removeItem('GameGuard');
                    this.props.history.push('/lobbyOverview');
                }

            } else {
                alert("You can only leave the game in the forth phase ('Word Reveal')!");
            }
        } catch(error) {
            console.log('Error in leaveGame()', handleError(error))
        }
    }

    /** Lets a player mute the sounds */
    turnSoundOnAndOff() {
        if (this.state.soundOn) {
        this.setState({soundOn: false});
        }
        else {this.setState({soundOn: true}) ;
        }
    }

    /** Responsible for playing a sound if the guess has been correct */
    playCorrectGuessAudio() {
        let audio = new Audio('https://www.talkingwav.com/wp-content/uploads/2017/10/cheering.wav');
        audio.play();
    }

    /** Responsible for playing a sound if the guess has been incorrect */
    playWrongGuessAudio() {
        let audio = new Audio('https://www.talkingwav.com/wp-content/uploads/2017/10/mario_06.wav');
        audio.play();
    }

    /** Responsible for displaying a guess and signal its correctness */
    displayGuess() {
        if (this.state.phaseNumber === 4 && (this.state.guess !== null || this.state.guess !== "")) {
            if (this.state.clonePlayers.includes(this.state.activePlayer)) {
                for (let i = 0; i < this.state.clonePlayers.length; i++) {
                    if (this.state.clonePlayers[i] === this.state.activePlayer) {
                        let output = document.getElementById("clue" + (i + 2));
                        output.textContent = this.state.guess;
                        if (this.state.validGuess === true) {
                            let field = document.getElementById("field" + (2 + i));
                            field.style.backgroundColor = "#0900ff";
                        } else {
                            let field = document.getElementById("field" + (2 + i));
                            field.style.backgroundColor = "#ED0101";
                        }
                    }
                }
            } else {
                let output = document.getElementById("clue1");
                output.textContent = this.state.guess;
                if (this.state.validGuess === true) {
                    let field = document.getElementById("field1");
                    field.style.backgroundColor = "#0900ff";
                } else {
                    let field = document.getElementById("field1");
                    field.style.backgroundColor = "#ED0101";
                }
            }
        }
    }


    /** This method makes sure that the input given by the different players is triggers the corresponding effects
     * based on the role of the player (active or passive player) and the phase number (between 1 and 3, in phase 4
     * no input is taken).
     * @param: string playerName
     * @param: string input */
    handleInput(playerName, input) {
        if (playerName === localStorage.getItem('username')) {
            if (playerName === this.state.activePlayer) {
                if (this.state.phaseNumber === 1) {
                    this.determineMysteryWord(input);
                }
                if (this.state.phaseNumber === 3) {
                    this.setGuess(input);
                }
            }
            if (this.state.passivePlayers.includes(playerName)) {
                if (this.state.phaseNumber === 2) {
                    this.giveClue(input);
                }
            }
        }
    }

    /** Makes easter eggs visible
     * @param: string value */
    showEasterEgg(value) {
        document.getElementById(value).style.display = "block";
    }

    /** Hides easter egg (default state)
     * @param: string value */
    hideEasterEgg(value) {
        document.getElementById(value).style.display = "none";
    }

    /** Handles input typed in input fields (and renders easter eggs conditionally)
     * @param: string key
     * @param: string key */
    handleInputChange(key, value) {
        if (value === "wow" || value === "pure beauty" || value === "rachid" || value === "mexicans" || value === "hate crime") {
            this.showEasterEgg(value);
            setTimeout(() => this.hideEasterEgg(value), 3000);
        }
        if (value === "milestone 4 abgabe") {
            this.showEasterEgg(value);
            setTimeout(() => this.hideEasterEgg(value), 2800);
        }
        if (value === "rachid") {
            this.showEasterEgg(value);
            setTimeout(() => this.hideEasterEgg(value), 2500);
        }
        if (value === "kawaii" || value === "hentai" || value === "harem" || value === "sugoi" ||
            value === "yaoi" || value === "yuri" || value === "ahegao" || value === "rule34") {

            this.showEasterEgg("weeb");
            setTimeout(() => this.hideEasterEgg("weeb"), 6000);
        }
        if (value === "cute") {
            this.showEasterEgg(value);
            setTimeout(() => this.hideEasterEgg(value), 4000);
        }
        this.setState({[key]: value});
    }

    /** Called constantly in order to update the phase */
    updatePhase() {
        /** Only phase 4 has always a guess that's not empty */
        if (this.state.guess !== "") {
            if (this.state.phaseNumber !== 4) {
                this.setState({
                    timer: this.state.nextTimer[3],
                    phaseNumber: 4
                });
                if (this.state.validGuess && this.state.soundOn) {
                    this.playCorrectGuessAudio();
                } else if (this.state.soundOn) {
                    this.playWrongGuessAudio();
                }
            }
            this.updatePhaseHUD(4);
            /** In Phase 3 when all players gave a clue */
        } else if (this.state.passivePlayersCluesGiven.length === this.state.passivePlayers.length) {
            if (this.state.phaseNumber !== 3) {
                this.setState({
                    timer: this.state.nextTimer[2],
                    phaseNumber: 3
                });
            }
            this.unsignalSubmission();
            this.updatePhaseHUD(3);
        }
        /** Only phase 2 always has a chosen mystery word */
        else if (this.state.mysteryWord !== "" || this.state.mysteryWordId !== null) {
            if (this.state.phaseNumber !== 2) {
                this.setState({
                    timer: this.state.nextTimer[1],
                    phaseNumber: 2
                });
            }
            this.updatePhaseHUD(2);
        }
        /** Only phase 1 has always none of these above */
        else if (this.state.currentCard !== []) {
            if (this.state.phaseNumber !== 1) {
                this.setState({
                    timer: this.state.nextTimer[0],
                    phaseNumber: 1,
                    round: this.state.round + 1
                });
                this.unsignalSubmission();
                this.undoCrossingOut();
                this.undoClueDisplay();
            }
            this.updatePhaseHUD(1);
        }
    }

    /** Displays the endgame overlay */
    async endgamOverlayOn() {
        if (document.getElementById("end") !== null) {
            document.getElementById("end").style.display = "block";
        }
    }

    /** Updates phase HUD in upper right corner
     * @param: int id */
    updatePhaseHUD(id) {
        for (let i = 1; i <= 4; i++) {
            if (i === id) {
                if (id === 1 || id === 3) {
                    let greenPhase = document.getElementById("phase" + i);
                    greenPhase.style.backgroundColor = "#FF0000";
                } else if (id === 2) {
                    let greenPhase = document.getElementById("phase" + i);
                    greenPhase.style.backgroundColor = "#FCC812";
                } else if (id === 4) {
                    let greenPhase = document.getElementById("phase" + i);
                    greenPhase.style.backgroundColor = "#05FF00";
                }
            } else {
                let greyPhase = document.getElementById("phase" + i);
                greyPhase.style.backgroundColor = "#817857";
            }
        }
    }

    /** Updates the signal field next in a player HUD upon clue submission
     * @param: string player */
    async signalClueSubmission(player) {
        if (this.state.clonePlayers.includes(player)) {
            let i = this.state.clonePlayers.indexOf(player);
            let field = document.getElementById("field" + (2 + i));
            field.style.backgroundColor = "#0900ff";
        } else {
            let field = document.getElementById("field1");
            field.style.backgroundColor = "#0900ff";
        }
    }

    /** Undoes signaling of clue submission at start of phase 4 */
    async unsignalSubmission() {
        for (let i = 0; i < this.state.players.length; i++) {
            let field = document.getElementById("field" + (1 + i));
            field.style.backgroundColor = "#CBBD8C";
        }
    }

    /** Unifies all the methods that are polling in one method and calls them conditionally */
    handlePolling = async () => {
        try {
            if (!this.state.gameHasEnded) {
                if(this.state.pageRefreshed){
                    this.getCard();
                    this.setState({
                        pageRefreshed: false
                    });
                } else {
                    this.updatePhase();
                }
                if (this.state.phaseNumber === 1) {
                    this.getMysteryWord();
                    this.getCluePlayers();

                    this.getPlayers();
                    this.getCardAmount();
                    this.getScores();
                    this.getCard();

                } else if (this.state.phaseNumber === 2) {
                    this.getCluePlayers();
                    this.getMysteryWord();

                    this.getPlayers();
                    this.getCard();
                    this.getCardAmount();
                    this.getScores();

                } else if (this.state.phaseNumber === 3) {
                    this.getValidClues();
                    this.getCluePlayers();
                    this.getGuess();
                    this.getMysteryWord();

                    this.getPlayers();
                    this.getCardAmount();
                    this.getScores();
                    this.getCard();

                } else if (this.state.phaseNumber === 4) {
                    this.getMysteryWord();
                    this.getGuess();
                    this.getCluePlayers();
                    this.getValidClues();

                    this.getPlayers();
                    this.getCardAmount();
                    this.getScores();
                    // this.getCard();

                } else {
                    alert("The phase number is not in the range from 1 to 4!")
                }
            }
        } catch (error) {
            console.log('Error in handlePolling()', handleError(error))
        }
    };

    async componentDidMount() {
        if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")){
            this.setState({sound: false, disableSoundButton: true})
        }
        try {

            this.getPlayers();
            this.getPhase();
            setTimeout(() => this.deleteGameSetUp(), 5000);

        } catch (error) {
            console.log('Error in componentDidMount', handleError(error))
        }
    }

    async componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.intervalIsStillAlive);
    }

    /** Makes sure input can be given using the enter key
     * @param: event e */
    keyPressed(e) {
        if (e.keyCode === 13) {
            this.handleInput(localStorage.getItem('username'), this.state.player1Input);
            this.setState({
                player1input: null
            })
        }
    }

    /** Subtask such that task of playersWithoutUsers(players) is completed
     * @param: string[] players
     * @return: string[] players*/
    async playerOrder(players) {
        if (players.length >= 3) {
            array_move(players, 2, 0);
        }
        if (players.length >= 5) {
            array_move(players, 4, 0)
        }
        return players
    }

    /** Sorts player list such that the role of active player is changed clockwise
     * @param: string[] players
     * @return: string[] clonePlayers*/
    async playersWithoutUser(players) {
        let clonePlayers = [];
        for (let i = (players.indexOf(localStorage.getItem('username'))+1); i<players.length; i++) {
            clonePlayers.push(players[i])
        }

        for (let j = 0; j<players.indexOf(localStorage.getItem('username')); j++) {
            clonePlayers.push(players[j])
        }

        this.playerOrder(clonePlayers);

        return clonePlayers;
    }

    render() {
        return (
            <Game>
                {console.log('players without user 1', this.playersWithoutUser(["1", "2", "3", "4", "5", "6", "7"]))}
                {console.log('players without user 1', this.playersWithoutUser(["1", "2", "3", "4", "5", "6"]))}
                {console.log('players without user 1', this.playersWithoutUser(["1", "2", "3", "4", "5"]))}
                {console.log('players without user 1', this.playersWithoutUser(["1", "2", "3", "4"]))}
                {console.log('players without user 1', this.playersWithoutUser(["1", "2", "3"]))}
                {console.log('players', this.state.players)}
                {console.log('clone players', this.state.clonePlayers)}
                <PhaseMessageComponent activePlayer={this.state.activePlayer} passivePlayers={this.state.passivePlayers}
                                       phaseNumber={this.state.phaseNumber} remainingCards={this.state.remainingCards}/>
                <EasterEggs/>
                <SoundButton hidden ={this.state.disableSoundButton} style={{cursor: "pointer"}} onClick={() => {
                    this.turnSoundOnAndOff();
                }}>
                    <img src={SoundIcon} alt={"Mute Button"} style={{position: "relative", left: "20%", top: "20%", visibility: (this.state.disableSoundButton ? "hidden" : "show")}}/>
                    <img src={MuteIcon} alt={"Mute Button"} style={{position: "absolute", left: "0%", display: (this.state.soundOn ? "none" : "inline"), visibility: (this.state.disableSoundButton ? "hidden" : "show")}}/>
                </SoundButton>
                <EndGameContainer id={"end"}>
                    <GameOver> Well played! </GameOver>
                    <StatisticsContainer>
                        <Statistics> Total Words guessed: {this.state.totalGuesses} </Statistics>
                        <Statistics> Most Words
                            guessed: {this.state.mostGuesses.playerName} ({this.state.mostGuesses.numberOfCorrectlyGuessedMysteryWords}) </Statistics>
                        <Statistics> Least Words
                            guessed: {this.state.leastGuesses.playerName} ({this.state.leastGuesses.numberOfCorrectlyGuessedMysteryWords}) </Statistics>
                        <Statistics> Highest
                            Score: {this.state.highestScore.playerName} ({this.state.highestScore.score})</Statistics>
                    </StatisticsContainer>
                    <Waiting> Redirected in 15 seconds... </Waiting>
                </EndGameContainer>
                {/*Timer and Phase*/}
                <HUDContainer>
                    <Timer seconds={this.state.timer} phaseNumber={this.state.phaseNumber}
                           determineMysteryWord={this.determineMysteryWord} round={this.state.round}
                           giveClue={this.giveClue} setGuess={this.setGuess} gameHasEnded={this.gameHasEnded}
                           gameId={this.state.gameId} mysteryWord={this.state.mysteryWord} soundOn={this.state.soundOn}/>
                    <Phase>
                        <PhaseCircle id={"phase1"} style={{left: "26px", backgroundColor: "#FF0000"}}/>
                        <PhaseCircle id={"phase2"} style={{left: "82px"}}/>
                        <PhaseCircle id={"phase3"} style={{left: "138px"}}/>
                        <PhaseCircle id={"phase4"} style={{left: "194px"}}/>
                        <PhaseMessage> {this.state.phases[this.state.phaseNumber - 1]} </PhaseMessage>
                    </Phase>
                </HUDContainer>
                {/*First Player Row*/}
                <PlayerContainer>
                    {/*Player 2*/}
                    {this.state.players.length >= 2 ? (
                        <Player style={{marginTop: "-8%", marginLeft: "20%"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer} number={2}/>
                        </Player>
                    ) : (<Player/>)}
                    {/*Player 3*/}
                    {this.state.players.length >= 3 ? (
                        <Player style={{marginTop: "-8%", marginRight: "20%", float: "right"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer} number={3}/>
                        </Player>
                    ) : (<Player/>)}
                </PlayerContainer>
                {/*Second Player Row*/}
                <PlayerContainer>
                    {/*Player 4*/}
                    {this.state.players.length >= 4 ? (
                        <Player style={{marginTop: "2%", marginLeft: "0%"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer} number={4}/>
                        </Player>
                    ) : (<Player/>)}
                    {/*Player 5*/}
                    {this.state.players.length >= 5 ? (
                        <Player style={{marginTop: "2%", marginRight: "0%", float: "right"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer} number={5}/>
                        </Player>
                    ) : (<Player/>)}
                </PlayerContainer>
                {/*The GameBoard and its Content*/}
                <TableContainer>
                    <Table>
                        <BoardContainer>
                            <GuessedCards style={{position: "absolute", left: "1.5%", bottom: "1%"}}/>
                            <GuessedCards style={{position: "absolute", left: "0.75%", bottom: "2%"}}/>
                            <GuessedCards style={{position: "absolute", bottom: "3.5%"}}>
                                {this.state.guessedCards[0] + this.state.guessedCards[1] + this.state.guessedCards[2] +
                                this.state.guessedCards[3] + this.state.guessedCards[4] + this.state.guessedCards[5] + this.state.guessedCards[6]}
                            </GuessedCards>
                            <Deck style={{position: "absolute", bottom: "1%", left: "20%"}}/>
                            <Deck style={{position: "absolute", bottom: "2%", left: "19%"}}/>
                            <Deck style={{position: "absolute", bottom: "3.5%", left: "18%"}}>
                                {this.state.remainingCards}
                            </Deck>
                            {this.state.activePlayer !== localStorage.getItem('username') || this.state.phaseNumber === 4 ? (
                                <ActiveCardContainer id={"activeCard"}>
                                    <Number style={{color: "#00CDCD", top: "17.5px"}}> 1. </Number>
                                    <Word id={"word1"} style={{borderColor: "#00CDCD", top: "17.5px"}}>
                                        {this.state.currentCard[0]} </Word>
                                    <Number style={{color: "#42c202", top: "65px"}}> 2. </Number>
                                    <Word id={"word2"} style={{borderColor: "#42c202", top: "35px"}}>
                                        {this.state.currentCard[1]} </Word>
                                    <Number style={{color: "#db3d3d", top: "112.5px"}}> 3. </Number>
                                    <Word id={"word3"} style={{borderColor: "#db3d3d", top: "52.5px"}}>
                                        {this.state.currentCard[2]} </Word>
                                    <Number style={{color: "#fc9229", top: "160px"}}> 4. </Number>
                                    <Word id={"word4"} style={{borderColor: "#fc9229", top: "70px"}}>
                                        {this.state.currentCard[3]} </Word>
                                    <Number style={{color: "#ffe203", top: "207.5px"}}> 5. </Number>
                                    <Word id={"word5"} style={{borderColor: "#ffe203", top: "87.5px"}}>
                                        {this.state.currentCard[4]} </Word>
                                </ActiveCardContainer>
                            ) : (
                                <ActiveCardContainer id={"activeCard"} pulsate={this.state.phaseNumber === 1 && localStorage.getItem('username') === this.state.activePlayer}>
                                    <Number style={{color: "#00CDCD", top: "17.5px"}}> 1. </Number>
                                    <ChooseWord id={"word1"} style={{borderColor: "#00CDCD", top: "17.5px"}}
                                          disabled={this.state.phaseNumber !== 1 || localStorage.getItem('username') !== this.state.activePlayer}
                                          onClick={() => {this.determineMysteryWord(1)}}> ??? </ChooseWord>
                                    <Number style={{color: "#42c202", top: "65px"}}> 2. </Number>
                                    <ChooseWord id={"word2"} style={{borderColor: "#42c202", top: "35px"}}
                                          disabled={this.state.phaseNumber !== 1 || localStorage.getItem('username') !== this.state.activePlayer}
                                          onClick={() => {this.determineMysteryWord(2)}}> ??? </ChooseWord>
                                    <Number style={{color: "#db3d3d", top: "112.5px"}}> 3. </Number>
                                    <ChooseWord id={"word3"} style={{borderColor: "#db3d3d", top: "52.5px"}}
                                          disabled={this.state.phaseNumber !== 1 || localStorage.getItem('username') !== this.state.activePlayer}
                                          onClick={() => {this.determineMysteryWord(3)}}> ??? </ChooseWord>
                                    <Number style={{color: "#fc9229", top: "160px"}}> 4. </Number>
                                    <ChooseWord id={"word4"} style={{borderColor: "#fc9229", top: "70px"}}
                                          disabled={this.state.phaseNumber !== 1 || localStorage.getItem('username') !== this.state.activePlayer}
                                          onClick={() => {this.determineMysteryWord(4)}}> ??? </ChooseWord>
                                    <Number style={{color: "#ffe203", top: "207.5px"}}> 5. </Number>
                                    <ChooseWord id={"word5"} style={{borderColor: "#ffe203", top: "87.5px"}}
                                          disabled={this.state.phaseNumber !== 1 || localStorage.getItem('username') !== this.state.activePlayer}
                                          onClick={() => {this.determineMysteryWord(5)}}> ??? </ChooseWord>
                                </ActiveCardContainer>
                            )}
                        </BoardContainer>
                    </Table>
                </TableContainer>
                {/*Third Player Row*/}
                <PlayerContainer>
                    {/*Player 6*/}
                    {this.state.players.length >= 6 ? (
                        <Player style={{marginTop: "2%", marginLeft: "2%"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer} number={6}/>
                        </Player>
                    ) : (<Player/>)}
                    {/*Player 7*/}
                    {this.state.players.length >= 7 ? (
                        <Player style={{marginTop: "2%", marginRight: "2%", float: "right"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer} number={7}/>
                        </Player>
                    ) : (<Player/>)}
                </PlayerContainer>
                <PlayerContainer>
                    {/*Player 1*/}
                    {this.state.players.length >= 1 ? (
                        <Player style={{marginTop: "1%", marginLeft: "38%"}}>
                            <GuessedCardsField style={{top: "10%", left: "8%"}}/>
                            <GuessedCardsField
                                style={{top: "5%", left: "12%"}}>{this.state.guessedCards[0]}</GuessedCardsField>
                            <ScoreField>{this.state.scores[0]}</ScoreField>
                            {localStorage.getItem('username') !== this.state.activePlayer ?
                                <NameField>1. {localStorage.getItem('username')} </NameField> :
                                <NameFieldActivePlayer>1. {localStorage.getItem('username')} </NameFieldActivePlayer>}
                                <InputFieldPlayer disabled={this.state.player1Input || ((this.state.phaseNumber === 1 || this.state.phaseNumber === 3 || this.state.phaseNumber === 4) && localStorage.getItem('username') !== this.state.activePlayer) || ((this.state.phaseNumber === 1 || this.state.phaseNumber === 2 || this.state.phaseNumber === 4) && localStorage.getItem('username') === this.state.activePlayer) || (this.state.phaseNumber === 2 && localStorage.getItem('username') !== this.state.activePlayer && this.state.passivePlayersCluesGiven.includes(localStorage.getItem('username')))}>
                                    {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(localStorage.getItem('username'))) || this.state.phaseNumber === 4 ? (
                                        <Output id={"clue1"}></Output>
                                    ) : (
                                        ((this.state.phaseNumber === 3 && localStorage.getItem('username') === this.state.activePlayer) || (this.state.phaseNumber === 2 && localStorage.getItem('username') !== this.state.activePlayer)) ? (
                                            <Input placeholder="Enter here.." onChange=
                                                {e => {
                                                    this.handleInputChange('player1Input', e.target.value);
                                                }} onKeyDown={this.keyPressed}/>
                                        ) : (
                                            (this.state.phaseNumber === 1) ? (
                                                    (localStorage.getItem('username') !== this.state.activePlayer ? <Output> Wait for phase 2! </Output> : <Output> Click on a word! </Output>)
                                            ) : (
                                                <Output> Wait for phase 3! </Output>))
                                    )}
                                </InputFieldPlayer>
                            <SignalFieldPlayer id={"field1"}
                                               disabled={!this.state.player1Input || ((this.state.phaseNumber === 1 || this.state.phaseNumber === 3 || this.state.phaseNumber === 4) && localStorage.getItem('username') !== this.state.activePlayer) || ((this.state.phaseNumber === 2 || this.state.phaseNumber === 4) && localStorage.getItem('username') === this.state.activePlayer) || (this.state.phaseNumber === 2 && localStorage.getItem('username') !== this.state.activePlayer && this.state.passivePlayersCluesGiven.includes(localStorage.getItem('username')))}
                                               onClick={() => {
                                                   this.handleInput(localStorage.getItem('username'), this.state.player1Input);
                                                   this.setState({
                                                       player1Input: null
                                                   })
                                               }}>
                                <img src={ClickIcon} alt={"ClickIcon"}/>
                            </SignalFieldPlayer>
                        </Player>
                    ) : (<Player/>)}
                </PlayerContainer>
                <LeaveGameButtonContainer>
                <LogoutButton style={{width:"255px", border:"3px solid #000000", boxShadow:"7px 7px 10px rgba(0, 0, 0, 0.25)"}}
                              onClick={() => {
                                  this.leaveGame();
                              }}>
                    Leave Game
                </LogoutButton>
                </LeaveGameButtonContainer>
            </Game>
        );
    }
}

export default withRouter(InGame);
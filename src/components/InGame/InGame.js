import React from 'react';
import styled from 'styled-components';
import {api, handleError} from '../../helpers/api';
import {withRouter} from 'react-router-dom';
import Timer from "../timer/Timer";
import {GuessedCards, Deck, ActiveCardContainer, Number, Word, ChooseWord} from "../../views/design/InGame/CardsUI";
import {
    Game,
    BoardContainer,
    HUDContainer,
    TableContainer,
    Table,
    EndGameContainer,
    GameOver,
    Statistics,
    StatisticsContainer,
    Waiting
} from "../../views/design/InGame/InGameUI";
import {Phase, PhaseCircle, PhaseMessage} from "../../views/design/InGame/PhaseUI";
import {
    Player,
    PlayerContainer,
    SignalFieldPlayer,
    Input,
    Output,
    NameField,
    NameFieldActivePlayer,
    GuessedCardsField,
    ScoreField, InputFieldPlayer
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

const DrawCard = styled.div`
    position: absolute;
    width: 130px;
    height: 40px;
    top: 20px;
    left: 20px;
    background: #FFFFFF;
    border: 1.5px solid #000000;
    border-radius: 20px;
    box-sizing: border-box;
    font-size: 22px;
    text-align: center;
    line-height: normal;
    
    &:hover {
      transform: translateY(-2px);
    }
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    transition: all 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  margin: auto;
  width: 500px;
  top: 250px;
`;

const LeaveGameButtonContainer = styled.div`
  position: absolute;
  bottom: 40px;
  right: 50px;
  justify-content: center;
`;

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

    getRemainingTime(startTime) {
        let d = new Date();
        let newTime = d.getTime();
        let goneMSeconds = (newTime - startTime)%1000;  //gets gone miliseconds
        let goneSeconds = ((newTime - startTime) - goneMSeconds)/1000; // gets gone seconds
        let remainingSeconds = this.state.nextTimer[this.state.phaseNumber-1]-goneSeconds;

        return remainingSeconds;
    }

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
                this.overlayOn();
                setTimeout(() => this.deleteGame(), 16000);
                setTimeout(() => localStorage.removeItem('GameGuard'), 16000);
            } else {
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    this.resetMysteryWord();
                    this.resetMysteryWordId();
                    this.initializeTurn();
                }
            }

        } catch (error) {
            this.props.history.push('/lobbyOverview');
            alert(`Something went wrong while checking whether the game has ended!`);
            console.log('Error in gameHasEnded()', handleError(error))
        }
    }

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

    async crossOutWords(wordId) {
        for (let i = 0; i < this.state.currentCard.length; i++) {
            if (wordId - 1 !== i) {
                let lineThroughWord = document.getElementById("word" + (i + 1));
                lineThroughWord.style.textDecoration = "line-through";
            }
        }
    }

    async resetMysteryWord() {
        // if (this.state.phaseNumber === 4) {
            this.setState({
                mysteryWord: "",
            })
        // }
    }

    async resetMysteryWordId() {
        // if (this.state.phaseNumber === 4) {
            this.setState({
                mysteryWordId: null
            })
        // }
    }


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
                this.resetMysteryWord();
                this.resetMysteryWordId();
            }

        } catch (error) {
            console.log('Error in getMysteryWord', handleError(error));
            if (this.state.phaseNumber == 4) {
                this.resetMysteryWord();
                this.resetMysteryWordId();
            }
        }
    }

    async undoCrossingOut() {
        for (let i = 0; i < this.state.currentCard.length; i++) {
            let lineThroughWord = document.getElementById("word" + (i + 1));
            lineThroughWord.style.textDecoration = "none";
        }
    }

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
            } else {
                // alert('Only passive players can give clues!')
            }
        } catch (error) {
            console.log('Error in giveClue()', handleError(error))
        }
    }

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

    async undoClueDisplay() {
        for (let i = 0; i < this.state.clonePlayers.length; i++) {
            let output = document.getElementById("clue" + (2 + i));
            output.textContent = "";
        }
    }

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

    turnSoundOnAndOff() {
        if (this.state.soundOn) {
        this.setState({soundOn: false});
        }
        else {this.setState({soundOn: true}) ;
        }
    }

    playCorrectGuessAudio() {
        let audio = new Audio('https://www.talkingwav.com/wp-content/uploads/2017/10/cheering.wav');
        audio.play();
    }

    playWrongGuessAudio() {
        let audio = new Audio('https://www.talkingwav.com/wp-content/uploads/2017/10/mario_06.wav');
        audio.play();
    }

    displayGuess() {
        /**displays guess in phase 4*/
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
     * no input is taken). */
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

    showEasterEgg(value) {
        document.getElementById(value).style.display = "block";
    }

    hideEasterEgg(value) {
        document.getElementById(value).style.display = "none";
    }

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

    updatePhase() {
        /** Only Phase 4 has always a guess that's not empty */
        if (this.state.guess !== "") {
            /** if it is not Phase 4, change to 4 and reset Timer */
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
            /** Is Phase 3 when all Players gave an Clue */
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
        /** Only Phase 2 has always a chosen Mystery Word */
        else if (this.state.mysteryWord !== "" || this.state.mysteryWordId !== null) {
            if (this.state.phaseNumber !== 2) {
                this.setState({
                    timer: this.state.nextTimer[1],
                    phaseNumber: 2
                });
            }
            this.updatePhaseHUD(2);
        }
        /** Only Phase 1 has always none of these above*/
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

    async overlayOn() {
        if (document.getElementById("end") !== null) {
            document.getElementById("end").style.display = "block";
        }
    }

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

    async unsignalSubmission() {
        for (let i = 0; i < this.state.players.length; i++) {
            let field = document.getElementById("field" + (1 + i));
            field.style.backgroundColor = "#CBBD8C";
        }
    }

    /** This method makes sure that a player's page is updated correctly based on the role of the player (active
     * or passive player) and the phase number (between 1 and 4). */
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

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
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

    keyPressed(e) {
        if (e.keyCode === 13) {
            this.handleInput(localStorage.getItem('username'), this.state.player1Input);
            this.setState({
                chatMessage: "",
                player1input: null
            })
        }
    }

    async playerOrder(players) {
        if (players.length >= 3) {
            array_move(players, 2, 0);
        }
        if (players.length >= 5) {
            array_move(players, 4, 0)
        }
        return players
    }

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
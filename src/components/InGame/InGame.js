import React from 'react';
import styled from 'styled-components';
import {api, handleError} from '../../helpers/api';
import {withRouter} from 'react-router-dom';
import Timer from "../timer/Timer";
import {GuessedCards, Deck, ActiveCard, Number, Word} from "../../views/design/InGame/CardsUI";
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
import {TimerContainer, Round} from "../../views/design/InGame/TimerUI";
import {Phase, PhaseCircle, PhaseMessage} from "../../views/design/InGame/PhaseUI";
import {
    Player,
    PlayerContainer,
    SignalFieldPlayer,
    Input,
    InputField,
    Output,
    NameField,
    NameFieldActivePlayer,
    GuessedCardsField,
    ScoreField, InputFieldPlayer
} from "../../views/design/InGame/PlayerUI";
import ClickIcon from '../../views/pictures/ClickIcon.png'
import PlayerComponent from "../../views/PlayerComponent";

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
            timer: 3000,
            remainingCards: 13,
            guessedCards: [0, 0, 0, 0, 0, 0, 0],
            scores: [0, 0, 0, 0, 0, 0, 0],
            //frontend variables
            clueNumber: null,
            round: 1,
            phaseNumber: 1,
            phases: ["1. Choose Number", "2. Write Clues", "3. Guess Word", "4. Word Reveal"],
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
            totalGuesses: null,
        };
        // some error here...
        this.interval = setInterval(this.handlePolling, 500);
        this.intervalStillAlive = setInterval(this.stillAlive, 2000)
        this.handlePolling = this.handlePolling.bind(this);
        this.determineMysteryWord = this.determineMysteryWord.bind(this);
        this.giveClue = this.giveClue.bind(this);
        this.setGuess = this.setGuess.bind(this);
        this.gameHasEnded = this.gameHasEnded.bind(this);
        this.initializeTurn = this.initializeTurn.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
    }

    async initializeTurn() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token')
            });

            await api.put('/games/' + this.state.gameId + '/initializations', requestBody);

        } catch (error) {
            alert(`Something went wrong while initializing the turn!`);
            console.log('error', handleError(error))
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
                setTimeout(() => this.deleteGame(), 15000);
                setTimeout(() => localStorage.removeItem('GameGuard'), 15000);
            } else {
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    this.initializeTurn();
                }
            }
        } catch (error) {
            this.props.history.push('/lobbyOverview');
            alert(`Something went wrong while checking whether the game has ended!`);
            console.log('error', handleError(error))
        }
    }

    async deleteGame() {

        if (localStorage.getItem('username') === this.state.activePlayer) {
            this.deleteGameSetUp();
            await api.delete('/activeGames/' + this.state.gameId);
        }

        this.props.history.push('/lobbyOverview');

    }

    async deleteGameSetUp() {
        const requestBody = JSON.stringify({
            playerToken: localStorage.getItem('token')
        });

        await api.delete('/gameSetUps/' + this.state.gameId, {data: requestBody});
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
            console.log('error', handleError(error))
        }
    }

    async determineMysteryWord(wordId) {
        try {
            if (localStorage.getItem('username') === this.state.activePlayer) {
                /** Checking for valid input (not just in backend) */
                if (1 <= wordId && wordId <= 5) {
                    const requestBody = JSON.stringify({
                        wordId: wordId,
                        playerToken: localStorage.getItem('token')
                    });

                    this.setState({
                        mysteryWord: this.state.currentCard[wordId - 1],
                        mysteryWordId: wordId
                    });

                    await api.put('/games/' + this.state.gameId + "/mysteryWord", requestBody);

                    /** All words except for the mystery word on the card are crossed out. */
                    for (let i = 0; i < this.state.currentCard.length; i++) {
                        if (wordId - 1 !== i) {
                            let lineThroughWord = document.getElementById("word" + (i + 1));
                            lineThroughWord.style.textDecoration = "line-through";
                        }
                    }
                } else {
                    alert('You have to enter a number between one and five!')
                }
            }
        } catch (error) {
            if (error.response.status !== 500) {
                alert(`Something went wrong while determining the Mystery Word!`);
            }
            console.log('error', handleError(error))
        }
    }

    async resetMysteryWord() {
        if (this.state.phaseNumber === 4) {
            this.setState({
                mysteryWord: "",
                mysteryWordId: null
            })
        }
    }

    async getMysteryWord() {
        try {
            const response = await api.get('/games/' + this.state.gameId + "/mysteryWord/" + localStorage.getItem('token'));
            if (response.status === 200) {
                this.setState({
                    mysteryWord: response.data.word,
                });
            }

            for (let i = 0; i < this.state.currentCard.length; i++) {
                if (this.state.mysteryWord && this.state.mysteryWord === this.state.currentCard[i]) {
                    this.setState({
                        mysteryWordId: i + 1
                    });
                }
            }

            for (let k = 0; k < this.state.currentCard.length; k++) {
                if (this.state.mysteryWordId && this.state.currentCard[this.state.mysteryWordId - 1] !== this.state.currentCard[k]) {
                    let lineThroughWord = document.getElementById("word" + (k + 1));
                    lineThroughWord.style.textDecoration = "line-through";
                }
            }

            this.resetMysteryWord();
        } catch (error) {
            this.resetMysteryWord();
        }
    }

    async unsignalMysteryWord() {
        for (let k = 0; k < this.state.currentCard.length; k++) {
            let lineThroughWord = document.getElementById("word" + (k + 1));
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
            }
        } catch (error) {
            if (error.response.status !== 500 && error.response.status !== 401) {
                alert(`Something went wrong while trying to give a clue!`);
            }
            console.log('error', handleError(error))
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

            /** Making sure that the clue of the person who plays is also being displayed. This has
             * to be done separately since the player itself is not in the clonePlayers list. */
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

            /** display clues if valid*/
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

        } catch (error) {
            alert(`Something went wrong while getting the valid clues!`);
            console.log('error', handleError(error))
        }
    }

    async undisplayClues() {
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
            if (error.response.status !== 500) {
                alert(`Something went wrong while giving the guess!`);
            }
            console.log('error', handleError(error))
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
            alert(`Something went wrong while getting the guess!`);
            console.log('error', handleError(error))
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
                alert(`Something went wrong while getting the scores!`);
                console.log('error', handleError(error))
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
                alert(`Something went wrong while getting the highest score!`);
                console.log('error', handleError(error))
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
                alert(`Something went wrong while getting the highest number of guesses!`);
                console.log('error', handleError(error))
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
                alert(`Something went wrong while getting the lowest number of guesses!`)
                console.log('error', handleError(error))
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
                alert(`Something went wrong while getting the total number of guesses!`);
                console.log('error', handleError(error))
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
            if (error.response.status !== 204) {
                alert(`Something went wrong while getting the current Deck Size!`);
            }
            console.log('error', handleError(error))
        }
    }

    async getCluePlayers() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/clues/players/' + localStorage.getItem('token'));

            if (this.state.phaseNumber !== 4) {
                if (response.status === 200) {
                    for (let i = 0; i < response.data.length; i++) {
                        if (!this.state.passivePlayersCluesGiven.includes(response.data[i].playerName)) {
                            this.signalSubmission(response.data[i].playerName);
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
            if (error.response.status !== 204) {
                alert(`Something went wrong while trying to get the players and their clues!`);
            }
            console.log('error', handleError(error))
        }
    }

    async getPlayers() {
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
        } else {
            alert('You are not allowed to press other peoples buttons!');
        }
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({[key]: value});
    }

    updatePhase() {
        let nextTimer = [30, 50, 60, 10];
        /** Only Phase 4 has always a guess that's not empty */
        if (this.state.guess !== "") {
            /** if it is not Phase 4, change to 4 and reset Timer */
            if (this.state.phaseNumber !== 4) {
                console.log('gets in phase 4');
                this.setState({
                    timer: nextTimer[3],
                    phaseNumber: 4
                });
                this.updatePhaseHUD(4);
            }
        } else if (this.state.passivePlayersCluesGiven.length === this.state.passivePlayers.length) {
            if (this.state.phaseNumber !== 3) {
                console.log('gets in phase 3');
                this.setState({
                    timer: nextTimer[2],
                    phaseNumber: 3
                });
                this.updatePhaseHUD(3);
                this.unsignalSubmission();
            }
        }

        /** Only Phase 2 has always a chosen Mystery Word */
        else if (this.state.mysteryWord !== "" || this.state.mysteryWordId !== null) {
            if (this.state.phaseNumber !== 2) {
                console.log('gets in phase 2');
                this.setState({
                    timer: nextTimer[1],
                    phaseNumber: 2
                });
                this.updatePhaseHUD(2);
            }
        }
        /** Only Phase 1 has always none of these above*/
        else if (this.state.currentCard !== []) {
            if (this.state.phaseNumber !== 1) {
                console.log('gets in phase 1');
                this.setState({
                    timer: nextTimer[0],
                    phaseNumber: 1,
                    round: this.state.round + 1
                });
                this.updatePhaseHUD(1);
                this.unsignalSubmission();
                this.unsignalMysteryWord();
                this.undisplayClues();
            }
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

    async signalSubmission(player) {
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
                this.updatePhase();
                if (this.state.phaseNumber === 1) {
                    if (localStorage.getItem('username') === this.state.activePlayer) {
                        this.getPlayers();
                        this.getCard();
                        this.getMysteryWord();
                        this.getCluePlayers();
                        this.getCardAmount();
                        this.getScores();
                    }
                    if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                        this.getPlayers();
                        this.getCard();
                        this.getMysteryWord();
                        this.getCluePlayers();
                        this.getCardAmount();
                        this.getScores();
                    }
                } else if (this.state.phaseNumber === 2) {
                    if (localStorage.getItem('username') === this.state.activePlayer) {
                        this.getPlayers();
                        this.getCard();
                        this.getMysteryWord();
                        this.getCluePlayers();
                        this.getCardAmount();
                        this.getScores();
                    }
                    if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                        this.getPlayers();
                        this.getCard();
                        this.getMysteryWord();
                        this.getCluePlayers();
                        this.getCardAmount();
                        this.getScores();
                    }
                } else if (this.state.phaseNumber === 3) {
                    if (localStorage.getItem('username') === this.state.activePlayer) {
                        // does not need to do anything since getting the guess is coupled to button clicking for the active player
                        this.getMysteryWord();
                        this.getPlayers();
                        this.getValidClues();
                        this.getCluePlayers();
                        this.getGuess();
                        this.getCardAmount();
                        this.getScores();
                    }
                    if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                        this.getMysteryWord();
                        this.getPlayers();
                        this.getValidClues();
                        this.getCluePlayers();
                        this.getGuess();
                        this.getCardAmount();
                        this.getScores();
                    }
                } else if (this.state.phaseNumber === 4) {
                    this.getMysteryWord();
                    this.getGuess();
                    this.getPlayers();
                    this.getCluePlayers();
                    this.getValidClues();
                    this.getCardAmount();
                    this.getScores();
                } else {
                    alert("The phase number is not in the range from 1 to 4!")
                }
            }
        } catch (error) {
            alert(`Something went wrong during the polling process!`);
            console.log('error', handleError(error))
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
        try {

            this.getPlayers();

        } catch (error) {
            alert(`Something went wrong while fetching the players!`);
            console.log('error', handleError(error))
        }
    }

    async componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.intervalStillAlive)
    }

    async playersWithoutUser(players) {
        let clonePlayers = [...players];
        let index = clonePlayers.indexOf(localStorage.getItem('username'));
        if (index > -1) {
            clonePlayers.splice(index, 1);
        }
        return clonePlayers;
    }

    stillAlive = async () => {
        try {
            await api.put('/games/'+ this.state.activeGameId +'/phases', localStorage.getItem('token'));
        } catch (error) {

        }
    };

    render() {
        return (
            <Game>
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
                    <TimerContainer>
                        <Round> Round {this.state.round} </Round>
                        <Timer seconds={this.state.timer} phaseNumber={this.state.phaseNumber}
                               determineMysteryWord={this.determineMysteryWord}
                               giveClue={this.giveClue} setGuess={this.setGuess} gameHasEnded={this.gameHasEnded}
                               gameId={this.state.gameId} mysteryWord={this.state.mysteryWord}/>
                    </TimerContainer>
                    <Phase>
                        <PhaseCircle id={"phase1"} style={{left: "26px", backgroundColor: "#FF0000"}}/>
                        <PhaseCircle id={"phase2"} style={{left: "82px"}}/>
                        <PhaseCircle id={"phase3"} style={{left: "138px"}}/>
                        <PhaseCircle id={"phase4"} style={{left: "194px"}}/>
                        {/* need props here, just placeholder for now*/}
                        <PhaseMessage> {this.state.phases[this.state.phaseNumber - 1]} </PhaseMessage>
                    </Phase>
                </HUDContainer>
                {/*First Player Row*/}
                <PlayerContainer>
                    {/*Player 2*/}
                    {this.state.players.length >= 2 ? (
                        <Player style={{marginTop: "-8%", marginLeft: "20%"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer}
                                             number={2}/>
                        </Player>
                    ) : (<Player/>)}
                    {/*Player 3*/}
                    {this.state.players.length >= 3 ? (
                        <Player style={{marginTop: "-8%", marginRight: "20%", float: "right"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer}
                                             number={3}/>
                        </Player>
                    ) : (<Player/>)}
                </PlayerContainer>
                {/*Second Player Row*/}
                <PlayerContainer>
                    {/*Player 4*/}
                    {this.state.players.length >= 4 ? (
                        <Player style={{marginTop: "2%", marginLeft: "0%"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer}
                                             number={4}/>
                        </Player>
                    ) : (<Player/>)}
                    {/*Player 5*/}
                    {this.state.players.length >= 5 ? (
                        <Player style={{marginTop: "2%", marginRight: "0%", float: "right"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer}
                                             number={5}/>
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
                                <ActiveCard id={"activeCard"}>
                                    <Number style={{color: "#00CDCD", top: "17.5px"}}> 1. </Number>
                                    <Word id={"word1"} style={{
                                        borderColor: "#00CDCD",
                                        top: "17.5px"
                                    }}> {this.state.currentCard[0]} </Word>
                                    <Number style={{color: "#42c202", top: "65px"}}> 2. </Number>
                                    <Word id={"word2"} style={{
                                        borderColor: "#42c202",
                                        top: "35px"
                                    }}> {this.state.currentCard[1]} </Word>
                                    <Number style={{color: "#db3d3d", top: "112.5px"}}> 3. </Number>
                                    <Word id={"word3"} style={{
                                        borderColor: "#db3d3d",
                                        top: "52.5px"
                                    }}> {this.state.currentCard[2]} </Word>
                                    <Number style={{color: "#fc9229", top: "160px"}}> 4. </Number>
                                    <Word id={"word4"} style={{
                                        borderColor: "#fc9229",
                                        top: "70px"
                                    }}> {this.state.currentCard[3]} </Word>
                                    <Number style={{color: "#ffe203", top: "207.5px"}}> 5. </Number>
                                    <Word id={"word5"} style={{
                                        borderColor: "#ffe203",
                                        top: "87.5px"
                                    }}> {this.state.currentCard[4]} </Word>
                                </ActiveCard>
                            ) : (
                                <ActiveCard id={"activeCard"}>
                                    {/* The words are only placeholders, as are the numbers */}
                                    <Number style={{color: "#00CDCD", top: "17.5px"}}> 1. </Number>
                                    <Word id={"word1"} style={{borderColor: "#00CDCD", top: "17.5px"}}> ??? </Word>
                                    <Number style={{color: "#42c202", top: "65px"}}> 2. </Number>
                                    <Word id={"word2"} style={{borderColor: "#42c202", top: "35px"}}> ??? </Word>
                                    <Number style={{color: "#db3d3d", top: "112.5px"}}> 3. </Number>
                                    <Word id={"word3"} style={{borderColor: "#db3d3d", top: "52.5px"}}> ??? </Word>
                                    <Number style={{color: "#fc9229", top: "160px"}}> 4. </Number>
                                    <Word id={"word4"} style={{borderColor: "#fc9229", top: "70px"}}> ??? </Word>
                                    <Number style={{color: "#ffe203", top: "207.5px"}}> 5. </Number>
                                    <Word id={"word5"} style={{borderColor: "#ffe203", top: "87.5px"}}> ??? </Word>
                                </ActiveCard>
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
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer}
                                             number={6}/>
                        </Player>
                    ) : (<Player/>)}
                    {/*Player 7*/}
                    {this.state.players.length >= 7 ? (
                        <Player style={{marginTop: "2%", marginRight: "2%", float: "right"}}>
                            <PlayerComponent scores={this.state.scores} guessedCards={this.state.guessedCards}
                                             clonePlayers={this.state.clonePlayers} activePlayer={this.state.activePlayer}
                                             number={7}/>
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
                                <InputFieldPlayer disabled={((this.state.phaseNumber === 1 || this.state.phaseNumber === 3 || this.state.phaseNumber === 4) && localStorage.getItem('username') !== this.state.activePlayer) || ((this.state.phaseNumber === 2 || this.state.phaseNumber === 4) && localStorage.getItem('username') === this.state.activePlayer) || (this.state.phaseNumber === 2 && localStorage.getItem('username') !== this.state.activePlayer && this.state.passivePlayersCluesGiven.includes(localStorage.getItem('username')))}>
                                    {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(localStorage.getItem('username'))) || this.state.phaseNumber === 4 ? (
                                        <Output id={"clue1"}></Output>
                                    ) : (
                                        (((this.state.phaseNumber === 1 || this.state.phaseNumber === 3) && localStorage.getItem('username') === this.state.activePlayer) || (this.state.phaseNumber === 2 && localStorage.getItem('username') !== this.state.activePlayer)) ? (
                                            <Input placeholder="Enter here.." onChange=
                                                {e => {
                                                    this.handleInputChange('player1Input', e.target.value);
                                                }}/>
                                        ) : (
                                            (this.state.phaseNumber === 1 && localStorage.getItem('username') !== this.state.activePlayer) ? (
                                                <Output> Wait for phase 2! </Output>
                                            ) : (
                                                <Output> Wait for phase 3! </Output>))
                                    )}
                                </InputFieldPlayer>
                            <SignalFieldPlayer id={"field1"}
                                               disabled={!this.state.player1Input || ((this.state.phaseNumber === 1 || this.state.phaseNumber === 3 || this.state.phaseNumber === 4) && localStorage.getItem('username') !== this.state.activePlayer) || ((this.state.phaseNumber === 2 || this.state.phaseNumber === 4) && localStorage.getItem('username') === this.state.activePlayer) || (this.state.phaseNumber === 2 && localStorage.getItem('username') !== this.state.activePlayer && this.state.passivePlayersCluesGiven.includes(localStorage.getItem('username')))}
                                               onClick={() => {
                                                   this.handleInput(localStorage.getItem('username'), this.state.player1Input);
                                               }}>
                                <img src={ClickIcon} alt={"ClickIcon"}/>
                            </SignalFieldPlayer>
                        </Player>
                    ) : (<Player/>)}
                </PlayerContainer>
            </Game>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(InGame);
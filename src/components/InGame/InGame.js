import React from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import Timer from "../timer/Timer";

//margin padding stuff:
//percentage for values relative to the browser
//absolute for absolute values

const GuessedCards = styled.div`
  width: 80px;
  height: 110px;

  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  font-size: 50px;
  text-align: center;
  line-height: 110px;
  color: #52ff02;
  
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
`;

const Deck = styled.div`
  width: 170px;
  height: 230px;

  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  font-size: 100px;
  text-align: center;
  line-height: 230px;
  
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
`;

const ActiveCard = styled.div`
  width: 180px;
  height: 255px;
  
  position: absolute;
  bottom: 0%;
  left: 60%;

  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
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

const Number = styled.div`
    position: absolute;
    padding: 4px 0;
    height: 30px;
    width: 10%;
    margin-left: 8px;
    margin-right: auto;
    
    font-family: Happy Monkey;
    font-size: 20px;
`;

const Word = styled.div`
    position: relative;
    padding: 5px 0;
    height: 30px;
    width: 80%;
    margin-left: 30px;
    margin-right: auto;
    
    border-style: solid;
    
    font-family: Happy Monkey;
    font-size: 15px;
    justify-content: center;
    display: flex;
`;

//The position of ActiveCard, Deck and GuessedCards are relative to BoardContainer
//because of position: relative and absolute
const BoardContainer = styled.div`
  width: 550px;
  height: 300px;
  display: inline-block;
  
  position: relative;
`;

const Game = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  //padding based on the resolution of the screen
  padding-top: 2%;
  padding-bottom: 1%;
  padding-left: 2%;
  padding-right: 2%;
  margin-left: auto;
  margin-right: auto;
  //min width and height of the game: prevents distortion
  min-width: 1366px;
  min-height: 768px;
  
  background: linear-gradient(180deg, #005C0F 0%, rgba(0, 147, 23, 0) 100%), #05F400;
`;

const TimerContainer = styled.div`
  position: relative;
  width: 175px;
  height: 175px;
  display: inline-block;
  border-radius: 50%;
  
  margin-left: 10px;

  background: #BDAF7E;
  border: 3px solid #000000;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

const Phase = styled.div`
  position: relative;
  width: 250px;
  height:125px;
  display: inline-block;
  float: right;
  //flattens the curve of Phase
  border-radius: 25px/25px;
  
  background: #BDAF7E;
  border: 3px solid #000000;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

//puts Phase and Timer in a box
const HUDContainer = styled.div`
`;

const Player = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  
  position: relative;
`;

const PlayerContainer = styled.div`
`;

const Table = styled.div`
  width: 1000px;
  height: 500px;
  border-radius: 1000px/500px;
  
  //allows player HUD to overlap the Table (ich bin so ein genius guy)
  margin-top: -225px;
  margin-bottom: -200px;
  
  align-items: center;
  justify-content: center;
  display: fix;
  
  background: linear-gradient(180deg, #CF7C00 0%, rgba(147, 88, 0, 0.0302086) 96.98%, rgba(114, 68, 0, 0) 100%), #773900;
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;


const TableContainer = styled.div`
  display: fix;
  align-items: center;
  justify-content: center;
`;

const Round = styled.div`
    position: absolute;
    top: 30px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-family: Happy Monkey;
    text-decoration: underline;
    font-size: 28px;
    justify-content: center;
    display: flex;
`;

const PhaseMessage = styled.div`
    position: absolute;
    top: 70px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-family: Happy Monkey;
    font-size: 24px;
    justify-content: center;
    display: flex;
`;

const PhaseCircle = styled.div`
    position: absolute;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: #817857;
    top: 20px;
    border: 2px solid #000000;
`;

//Player HUD related stuff

const ReadyField = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  // opacity: ${props => (props.disabled ? 0.8 : 1)};
  
  height: 70px;
  width: 70px;
  
  position: absolute;
  bottom: 5%;
  right: 5%;
  
  background: #CBBD8C;
  border: 3px solid #000000;
  border-radius: 100px;
  
  text-position: absolute;
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 70px;
  display: flex;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

const InputField = styled.div`
  height: 55px;
  width: 240px;
  
  position: absolute;
  bottom: 0%;
  
  background: #CBBD8C;
  border: 3px solid #000000;
  border-radius: 20px;
  
  padding-top: 3%;
  padding-left: 2%;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

const Input = styled.input`
&::placeholder {
    color: rgba(0, 0, 0, 1.0);
  }
  height: 55px;
  width: 240px;
  
  padding-bottom: 10%;
  padding-left: 5%;
  
  background: #CBBD8C;
  border:none;
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Output = styled.div`
  height: 55px;
  width: 240px;
  
  padding-bottom: 10%;
  padding-left: 5%;
  
  background: #CBBD8C;
  border:none;
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NameField = styled.div`
  height: 45px;
  width: 160px;
  
  position: absolute;
  bottom: 34%;
  left: 1%;
  
  background: #FCC812;
  border: 3px solid #000000;
  border-radius: 20px;

  padding-top: 1.25%;
  padding-left: 1.5%;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NameFieldActivePlayer = styled.div`
  height: 45px;
  width: 160px;
  
  position: absolute;
  bottom: 34%;
  left: 1%;
  
  background: #FF0000;
  border: 3px solid #000000;
  border-radius: 20px;

  padding-top: 1.25%;
  padding-left: 1.5%;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ScoreField = styled.div`
  height: 35px;
  width: 60px;
  
  position: absolute;
  bottom: 36%;
  left: 43%;
  
  text-align: center;
  padding-left: 5%
  padding-right: 3%;
  padding-top: 0.60%;
  
  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
`;

const GuessedCardsField = styled.div`
  height: 50px;
  width: 50px;
  
  position: absolute;
  
  padding-top: 0.5%;
  align-items: center;
  text-align: center;
  
  background: #FFFFFF;
  border: 2px solid #000000;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 23px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
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
            activePlayer: null,
            passivePlayers: [],
            passivePlayersCluesGiven: [],
            clues: [],
            guess: "",
            validGuess: false,
            timer: 15,
            remainingCards: 13,
            guessedCards: [0,0,0,0,0,0,0],
            scores: [0,0,0,0,0,0,0],
            //frontend variables
            clueNumber: null,
            round: 1,
            phaseNumber: 1,
            phases: ["Choose Number", "Write Clues", "Guess Word", "Word Reveal"],
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
            gameHasEnded: false
        };
        // some error here...
        this.interval = setInterval(this.handlePolling, 1000);
        this.handlePolling = this.handlePolling.bind(this);
        this.determineMysteryWord = this.determineMysteryWord.bind(this);
        this.giveClue = this.giveClue.bind(this);
        this.setGuess = this.setGuess.bind(this);
        this.gameHasEnded = this.gameHasEnded.bind(this);
        this.initializeTurn = this.initializeTurn.bind(this);
    }

    async initializeTurn() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token')
            });

            await api.put('/games/' + this.state.gameId + '/initializations', requestBody);

        } catch (error) {
            alert(`Something went wrong while initializing the turn: \n${handleError(error)}`);
        }
    }

    async gameHasEnded() {
        try {

            const response = await api.get('/games/' + this.state.gameId + '/ends/' + localStorage.getItem('token'));

            this.setState({
                gameHasEnded: response.data.hasEnded
            });

            if (this.state.gameHasEnded) {
                // show statistics
            } else {
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    this.initializeTurn();
                }
            }

        } catch (error) {
            alert(`Something went wrong while checking end: \n${handleError(error)}`);
        }
    }

    async getCard() {
        try {
            /** The active card is fetch (already set by POST request in first round and later initializeTurn()),
             * it's words are saved and displayed (for the passive players). The stack of remaining cards is updated. */
            const response = await api.get('/games/' + this.state.gameId + '/cards/' + localStorage.getItem('token'));

            if (response.status === 200 && response.data.words !== this.state.currentCard) {
                this.setState({
                    currentCard: response.data.words
                })
            }

            /** Button disappears and card is displayed after card is drawn. We use an if-statement to make sure
             * that these actions are only executed if the currentCard variable has actually been given a list of
             * five words. This is needed because the passive players will call this method on a regular interval
             * (polling) and often the card has not been drawn yet. */
        } catch (error) {
        }
    }

    async determineMysteryWord(wordId) {
        try {
            if (localStorage.getItem('username') === this.state.activePlayer) {
                /** Checking for valid input (not just in backend) */
                if (1 <= wordId <= 5) {
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
            alert(`Something went wrong while determining the Mystery Word: \n${handleError(error)}`)
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
            const response = await api.get('/games/'+this.state.gameId+"/mysteryWord/"+localStorage.getItem('token'));
            if (response.status === 200) {
                this.setState({
                    mysteryWord: response.data.word,
                });
            }

            for (let i = 0; i < this.state.currentCard.length; i++) {
                if (this.state.mysteryWord && this.state.mysteryWord === this.state.currentCard[i]) {
                    this.setState({
                        mysteryWordId: i+1
                    });
                }
            }

            console.log("getMysWordResponse",response.data);

            for (let k = 0; k < this.state.currentCard.length; k++) {
                if (this.state.mysteryWordId && this.state.currentCard[this.state.mysteryWordId-1] !== this.state.currentCard[k]) {
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
        for (let k=0 ; k<this.state.currentCard.length ; k++) {
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
            alert(`Something went wrong while trying to give a clue: \n${handleError(error)}`)
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

            // for (let i=0; i < this.state.players.length; i++) {
            //     for (let j=0; j < this.state.clues.length; j++) {
            //         if (this.state.clues[j].playerName === this.state.players[i]) {
            //             this.setState({
            //                 clues: this.state.clues[i].clue
            //             })
            //         }
            //     }
            // }

            /** display clues if valid*/
            for (let i=0; i < this.state.players.length; i++) {
                if (this.state.players[i] !== this.state.activePlayer) {
                    for (let j=0; j < this.state.clues.length; j++) {
                        if (this.state.clues[j].playerName === this.state.players[i]) {
                            let output = document.getElementById("clue" + (i + 1));
                            output.textContent = this.state.clues[j].clue;
                            break;
                        }
                        let output = document.getElementById("clue" + (i + 1));
                        output.textContent = "'invalid clue'";
                    }

                    if (this.state.clues.length === 0) {
                        for (let i = 0; i < this.state.players.length; i++) {
                            if (this.state.players[i] !== this.state.activePlayer) {
                                let output = document.getElementById("clue" + (i + 1));
                                output.textContent = "'invalid clue'";
                            }
                        }
                    }
                }
            }

        } catch (error) {
            alert(`Something went wrong while getting the valid clues: \n${handleError(error)}`);
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
            alert(`Something went wrong while giving the Guess: \n${handleError(error)}`);
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
            alert(`Something went wrong while getting the Guess: \n${handleError(error)}`);
        }
    }

    async getScores() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/statistics');

            if (response.status === 200) {

                let scoreList = [0,0,0,0,0,0,0];
                let guessedCardsList = [0,0,0,0,0,0,0];

                for (let i=0 ; i<this.state.players.length ; i++) {
                    for (let k=0 ; k<response.data.length ; k++) {
                        if (this.state.players[i] === response.data[k].playerName) {
                        scoreList[i] = response.data[k].score;
                        guessedCardsList[i] = response.data[k].numberOfCorrectlyGuessedMysteryWords;
                        }
                    }
                }
                this.setState({
                   scores: scoreList,
                   guessedCards: guessedCardsList
                });
            }
        } catch (error) {
            alert(`Something went wrong while getting the Scores: \n${handleError(error)}`);
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
            alert(`Something went wrong while getting the current Deck Size: \n${handleError(error)}`);
        }
    }

    async deleteGame() {
        try {

        } catch (error) {
            alert(`Something went wrong while deleting the Game: \n${handleError(error)}`);
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

            // tried to mark ready boxes of players who gave clue black (emphasis on tried)
            /*if (this.state.passivePlayersCluesGiven.length > 0) {
                for (let i = 0; i < this.state.passivePlayersCluesGiven.length; i++) {
                    let markBox = document.getElementById("field" + (i + 1));
                    markBox.style.background = "black";
                }
            }*/

        } catch (error) {
            alert(`Something went wrong while trying to get the players and their clues: \n${handleError(error)}`);
        }
    }

    async getPlayers() {
        const response = await api.get('/activeGames/' + this.props.match.params.id);

        if (response.data.activePlayerName !== this.state.activePlayer && !(this.state.round === 1 && this.state.phaseNumber === 1)) {
            this.setState({
                round: this.state.round + 1
            })
        }

        this.setState({
            gameId: this.props.match.params.id,
            players: response.data.playerNames,
            activePlayer: response.data.activePlayerName,
            passivePlayers: response.data.passivePlayerNames
        });
    }

    displayGuess() {
        /**displays guess in phase 4*/
        if (this.state.phaseNumber === 4 && (this.state.guess !== null || this.state.guess !== "")) {
            for (let i=0; i < this.state.players.length; i++) {
                if (this.state.players[i] === this.state.activePlayer) {
                    let output = document.getElementById("clue" + (i + 1));
                    output.textContent = this.state.guess;
                    if (this.state.validGuess === true) {
                        let field = document.getElementById("field"+(1+i));
                        field.style.backgroundColor = "#0900ff";
                    } else {
                        let field = document.getElementById("field"+(1+i));
                        field.style.backgroundColor = "#ED0101";
                    }
                }
            }
        }
    }


    /** This method makes sure that the input given by the different players is triggers the corresponding effects
     * based on the role of the player (active or passive player) and the phase number (between 1 and 3, in phase 4
     * no input is taken). */
    handleInput(playerName, input) {
        if (playerName === localStorage.getItem('username')) {
            //actions of active player
            if (playerName === this.state.activePlayer) {
                if (this.state.phaseNumber === 1) {
                    //determine mystery Word
                    this.determineMysteryWord(input);
                }
                if (this.state.phaseNumber === 3) {
                    //guess mystery word
                    this.setGuess(input);
                }
            }
            //actions of passive players
            if (this.state.passivePlayers.includes(playerName)) {
                if (this.state.phaseNumber === 2) {
                    //gives clue
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
        this.setState({ [key]: value });
    }

    updatePhase() {
        let nextTimer = [15,25,30,10];
        /** Only Phase 4 has always a guess that's not empty */
        if (this.state.guess !== "") {
            /** if it is not Phase 4, change to 4 and reset Timer */
            if (this.state.phaseNumber !== 4) {
                // console.log('gets in phase 4', this.state);
                this.setState({
                    timer: nextTimer[3],
                    phaseNumber: 4
                });
                this.updatePhaseHUD(4);
            }
        }
        else if (this.state.passivePlayersCluesGiven.length === this.state.passivePlayers.length) {
            if (this.state.phaseNumber !== 3) {
                // console.log('gets in phase 3', this.state);
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
                // console.log('gets in phase 2', this.state);
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
                // console.log('gets in phase 1', this.state);
                this.setState({
                    timer: nextTimer[0],
                    phaseNumber: 1
                });
                this.updatePhaseHUD(1);
                this.unsignalSubmission();
                this.unsignalMysteryWord();
                // for (let k = 0; k < this.state.currentCard.length; k++) {
                //     if (this.state.mysteryWordId && this.state.currentCard[this.state.mysteryWordId-1] !== this.state.currentCard[k]) {
                //         let lineThroughWord = document.getElementById("word" + (k + 1));
                //         lineThroughWord.style.textDecoration = "none";
                //     }
                // }
            }
        }
    }

    updatePhaseHUD(id) {
        for (let i=1 ; i<=4 ; i++) {
            if (i === id) {
                let greenPhase = document.getElementById("phase"+i);
                greenPhase.style.backgroundColor = "#05FF00";
            } else {
                let greyPhase = document.getElementById("phase"+i);
                greyPhase.style.backgroundColor = "#817857";
            }
        }
    }

    async signalSubmission(player) {
        let i = this.state.players.indexOf(player);
        let field = document.getElementById("field"+(1+i));
        field.style.backgroundColor = "#0900ff";
    }

    async unsignalSubmission() {
        for (let i=0; i < this.state.players.length; i++) {
            let field = document.getElementById("field"+(1+i));
            field.style.backgroundColor = "#CBBD8C";
        }
    }

    /** This method makes sure that a player's page is updated correctly based on the role of the player (active
     * or passive player) and the phase number (between 1 and 4). */
    handlePolling = async () => {
        try {
            this.updatePhase();
            if (this.state.phaseNumber === 1) {
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    this.getPlayers();
                    this.getCard();
                    this.getMysteryWord();
                    this.getCluePlayers();
                    this.getCardAmount();
                    this.getScores();

                    console.log("PhaseNumber", this.state.phaseNumber);
                    console.log("CurrentCard", this.state.currentCard);
                    console.log("MysteryWord", this.state.mysteryWord);
                    console.log("MysteryWordId", this.state.mysteryWordId);
                    console.log("Clues", this.state.clues);
                    console.log("Guess", this.state.guess);
                    console.log("GameHasEnded", this.state.gameHasEnded);
                }
                if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                    this.getPlayers();
                    this.getCard();
                    this.getMysteryWord();
                    this.getCluePlayers();
                    this.getCardAmount();
                    this.getScores();

                    console.log("PhaseNumber", this.state.phaseNumber);
                    console.log("CurrentCard", this.state.currentCard);
                    console.log("MysteryWord", this.state.mysteryWord);
                    console.log("MysteryWordId", this.state.mysteryWordId);
                    console.log("Clues", this.state.clues);
                    console.log("Guess", this.state.guess);
                    console.log("GameHasEnded", this.state.gameHasEnded);
                }
            } else if (this.state.phaseNumber === 2) {
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    this.getPlayers();
                    this.getCard();
                    this.getMysteryWord();
                    this.getCluePlayers();
                    this.getCardAmount();
                    this.getScores();

                    console.log("PhaseNumber", this.state.phaseNumber);
                    console.log("CurrentCard", this.state.currentCard);
                    console.log("MysteryWord", this.state.mysteryWord);
                    console.log("MysteryWordId", this.state.mysteryWordId);
                    console.log("Clues", this.state.clues);
                    console.log("Guess", this.state.guess);
                    console.log("GameHasEnded", this.state.gameHasEnded);
                }
                if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                    this.getPlayers();
                    this.getCard();
                    this.getMysteryWord();
                    this.getCluePlayers();
                    this.getCardAmount();
                    this.getScores();

                    console.log("PhaseNumber", this.state.phaseNumber);
                    console.log("CurrentCard", this.state.currentCard);
                    console.log("MysteryWord", this.state.mysteryWord);
                    console.log("MysteryWordId", this.state.mysteryWordId);
                    console.log("Clues", this.state.clues);
                    console.log("Guess", this.state.guess);
                    console.log("GameHasEnded", this.state.gameHasEnded);
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

                    console.log("PhaseNumber", this.state.phaseNumber);
                    console.log("CurrentCard", this.state.currentCard);
                    console.log("MysteryWord", this.state.mysteryWord);
                    console.log("MysteryWordId", this.state.mysteryWordId);
                    console.log("Clues", this.state.clues);
                    console.log("Guess", this.state.guess);
                    console.log("GameHasEnded", this.state.gameHasEnded);
                }
                if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                    this.getMysteryWord();
                    this.getPlayers();
                    this.getValidClues();
                    this.getCluePlayers();
                    this.getGuess();
                    this.getCardAmount();
                    this.getScores();

                    console.log("PhaseNumber", this.state.phaseNumber);
                    console.log("CurrentCard", this.state.currentCard);
                    console.log("MysteryWord", this.state.mysteryWord);
                    console.log("MysteryWordId", this.state.mysteryWordId);
                    console.log("Clues", this.state.clues);
                    console.log("Guess", this.state.guess);
                    console.log("GameHasEnded", this.state.gameHasEnded);
                }
            } else if (this.state.phaseNumber === 4) {
                this.getMysteryWord();
                this.getGuess();
                this.getPlayers();
                this.getCluePlayers();
                this.getValidClues();
                this.getCardAmount();
                this.getScores();

                console.log("PhaseNumber", this.state.phaseNumber);
                console.log("CurrentCard", this.state.currentCard);
                console.log("MysteryWord", this.state.mysteryWord);
                console.log("MysteryWordId", this.state.mysteryWordId);
                console.log("Clues", this.state.clues);
                console.log("Guess", this.state.guess);
                console.log("GameHasEnded", this.state.gameHasEnded);
            } else {
                alert("The phase number is not in the range from 1 to 4!")
            }
        } catch (error) {
            alert(`Something went wrong during the polling process: \n${handleError(error)}`);
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
            alert(`Something went wrong while fetching the players: \n${handleError(error)}`);
        }
    }

    async componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        // this construction of the variable name for the different timer seconds helps us to render the timer dynamically
        // let t = {};
        // let a = 1;
        // let b = 2;
        // let c = 3;
        // let d = 4;
        // t['timer' + a] = 15;
        // t['timer' + b] = 25;
        // t['timer' + c] = 30;
        // t['timer' + d] = 10;
        // -> maybe needed later
        return (
                <Game>
                    {/*Timer and Phase*/}
                    <HUDContainer>
                        <TimerContainer>
                            <Round> Round {this.state.round} </Round>
                            <Timer seconds={this.state.timer} phaseNumber={this.state.phaseNumber} determineMysteryWord={this.determineMysteryWord}
                                   giveClue={this.giveClue} setGuess={this.setGuess} gameHasEnded={this.gameHasEnded} gameId={this.state.gameId}/>
                        </TimerContainer>
                        <Phase>
                            <PhaseCircle id={"phase1"} style={{left:"26px", backgroundColor:"#05FF00"}}/>
                            <PhaseCircle id={"phase2"} style={{left:"82px"}}/>
                            <PhaseCircle id={"phase3"} style={{left:"138px"}}/>
                            <PhaseCircle id={"phase4"} style={{left:"194px"}}/>
                            {/* need props here, just placeholder for now*/}
                            <PhaseMessage> {this.state.phases[this.state.phaseNumber-1]} </PhaseMessage>
                        </Phase>
                    </HUDContainer>
                    {/*First Player Row*/}
                    <PlayerContainer>
                        {/*Player 2*/}
                        {this.state.players.length>=2 ? (
                        <Player style={{marginTop:"-8%", marginLeft:"20%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>{this.state.guessedCards[1]}</GuessedCardsField>
                            <ScoreField>{this.state.scores[1]}</ScoreField>
                            {this.state.players[1] !== this.state.activePlayer ?
                                <NameField>2. {this.state.players[1]}</NameField> :
                                <NameFieldActivePlayer>2. {this.state.players[1]}</NameFieldActivePlayer>}
                            <InputField>
                                {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[1])) || this.state.phaseNumber === 4 ? (
                                    <Output id={"clue2"}></Output>
                                ):(
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player2Input', e.target.value);}}/>)
                                }
                            </InputField>
                            <ReadyField id={"field2"} disabled={!this.state.player2Input}
                                        onClick={() => {this.handleInput(this.state.players[1],this.state.player2Input);}}>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                        {/*Player 3*/}
                        {this.state.players.length>=3 ? (
                        <Player style={{marginTop:"-8%", marginRight:"20%", float:"right"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>{this.state.guessedCards[2]}</GuessedCardsField>
                            <ScoreField>{this.state.scores[2]}</ScoreField>
                            {this.state.players[2] !== this.state.activePlayer ?
                                <NameField>3. {this.state.players[2]}</NameField> :
                                <NameFieldActivePlayer>3. {this.state.players[2]}</NameFieldActivePlayer>}
                            <InputField>
                                {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[2])) || this.state.phaseNumber === 4 ? (
                                    <Output id={"clue3"}></Output>
                                ):(
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player3Input', e.target.value);}}/>)
                                }
                            </InputField>
                            <ReadyField id={"field3"} disabled={!this.state.player3Input}
                                        onClick={() => {this.handleInput(this.state.players[2],this.state.player3Input);}}>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                    </PlayerContainer>
                    {/*Second Player Row*/}
                    <PlayerContainer>
                        {/*Player 4*/}
                        {this.state.players.length>=4 ? (
                        <Player style={{marginTop:"2%", marginLeft:"0%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>{this.state.guessedCards[3]}</GuessedCardsField>
                            <ScoreField>{this.state.scores[3]}</ScoreField>
                            {this.state.players[3] !== this.state.activePlayer ?
                                <NameField>4. {this.state.players[3]}</NameField> :
                                <NameFieldActivePlayer>4. {this.state.players[3]}</NameFieldActivePlayer>}
                            <InputField>
                                {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[3])) || this.state.phaseNumber === 4 ? (
                                    <Output id={"clue4"}></Output>
                                ):(
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player4Input', e.target.value);}}/>)
                                }
                            </InputField>
                            <ReadyField id={"field4"} disabled={!this.state.player4Input}
                                        onClick={() => {this.handleInput(this.state.players[3],this.state.player4Input);}}>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                        {/*Player 5*/}
                        {this.state.players.length>=5 ? (
                            <Player style={{marginTop:"2%", marginRight:"0%", float:"right"}}>
                                <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                                <GuessedCardsField style={{top:"5%", left:"12%"}}>{this.state.guessedCards[4]}</GuessedCardsField>
                                <ScoreField>{this.state.scores[4]}</ScoreField>
                                {this.state.players[4] !== this.state.activePlayer ?
                                    <NameField>5. {this.state.players[4]}</NameField> :
                                    <NameFieldActivePlayer>5. {this.state.players[4]}</NameFieldActivePlayer>}
                                <InputField>
                                    {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[4])) || this.state.phaseNumber === 4 ? (
                                        <Output id={"clue5"}></Output>
                                    ):(
                                        <Input placeholder="Enter here.." onChange=
                                            {e => {this.handleInputChange('player5Input', e.target.value);}}/>)
                                    }
                                </InputField>
                                <ReadyField id={"field5"} disabled={!this.state.player5Input}
                                            onClick={() => {this.handleInput(this.state.players[4],this.state.player5Input);}}>
                                </ReadyField>
                            </Player>
                        ): (<Player/>)}
                    </PlayerContainer>
                    {/*The GameBoard and its Content*/}
                    <TableContainer>
                        <Table>
                            <BoardContainer>
                                <GuessedCards style={{position:"absolute",left:"1.5%" ,bottom:"1%"}}/>
                                <GuessedCards style={{position:"absolute",left:"0.75%" ,bottom:"2%"}}/>
                                <GuessedCards style={{position:"absolute", bottom:"3.5%"}}>
                                    {this.state.guessedCards[0]+this.state.guessedCards[1]+this.state.guessedCards[2]+
                                    this.state.guessedCards[3]+this.state.guessedCards[4]+this.state.guessedCards[5]+this.state.guessedCards[6]}
                                </GuessedCards>
                                <Deck style={{position:"absolute", bottom:"1%", left:"20%"}}/>
                                <Deck style={{position:"absolute", bottom:"2%", left:"19%"}}/>
                                <Deck style={{position: "absolute", bottom: "3.5%", left: "18%"}}>
                                    {this.state.remainingCards}
                                </Deck>
                                {this.state.activePlayer !== localStorage.getItem('username') || this.state.phaseNumber === 4 ? (
                                <ActiveCard id={"activeCard"}>
                                        <Number style={{color:"#00CDCD", top:"17.5px"}}> 1. </Number>
                                        <Word id={"word1"} style={{borderColor:"#00CDCD", top:"17.5px"}}> {this.state.currentCard[0]} </Word>
                                        <Number style={{color:"#42c202", top:"65px"}}> 2. </Number>
                                        <Word id={"word2"} style={{borderColor:"#42c202", top:"35px"}}> {this.state.currentCard[1]} </Word>
                                        <Number style={{color:"#db3d3d", top:"112.5px"}}> 3. </Number>
                                        <Word id={"word3"} style={{borderColor:"#db3d3d", top:"52.5px"}}> {this.state.currentCard[2]} </Word>
                                        <Number style={{color:"#fc9229", top:"160px"}}> 4. </Number>
                                        <Word id={"word4"} style={{borderColor:"#fc9229", top:"70px"}}> {this.state.currentCard[3]} </Word>
                                        <Number style={{color:"#ffe203", top:"207.5px"}}> 5. </Number>
                                        <Word id={"word5"} style={{borderColor:"#ffe203", top:"87.5px"}}> {this.state.currentCard[4]} </Word>
                                    </ActiveCard>
                                ): (
                                    <ActiveCard id={"activeCard"}>
                                        {/* The words are only placeholders, as are the numbers */}
                                        <Number style={{color:"#00CDCD", top:"17.5px"}}> 1. </Number>
                                        <Word id={"word1"} style={{borderColor:"#00CDCD", top:"17.5px"}}> ??? </Word>
                                        <Number style={{color:"#42c202", top:"65px"}}> 2. </Number>
                                        <Word id={"word2"} style={{borderColor:"#42c202", top:"35px"}}> ??? </Word>
                                        <Number style={{color:"#db3d3d", top:"112.5px"}}> 3. </Number>
                                        <Word id={"word3"} style={{borderColor:"#db3d3d", top:"52.5px"}}> ??? </Word>
                                        <Number style={{color:"#fc9229", top:"160px"}}> 4. </Number>
                                        <Word id={"word4"} style={{borderColor:"#fc9229", top:"70px"}}> ??? </Word>
                                        <Number style={{color:"#ffe203", top:"207.5px"}}> 5. </Number>
                                        <Word id={"word5"} style={{borderColor:"#ffe203", top:"87.5px"}}> ??? </Word>
                                    </ActiveCard>
                                )}
                            </BoardContainer>
                        </Table>
                    </TableContainer>
                    {/*Third Player Row*/}
                    <PlayerContainer>
                        {/*Player 6*/}
                        {this.state.players.length>=6 ? (
                        <Player style={{marginTop:"2%", marginLeft:"2%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>{this.state.guessedCards[5]}</GuessedCardsField>
                            <ScoreField>{this.state.scores[5]}</ScoreField>
                            {this.state.players[5] !== this.state.activePlayer ?
                                <NameField>6. {this.state.players[5]}</NameField> :
                                <NameFieldActivePlayer>6. {this.state.players[5]}</NameFieldActivePlayer>}
                            <InputField>
                                {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[5])) || this.state.phaseNumber === 4 ? (
                                    <Output id={"clue6"}></Output>
                                ):(
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player6Input', e.target.value);}}/>)
                                }
                            </InputField>
                            <ReadyField id={"field6"} disabled={!this.state.player6Input}
                                        onClick={() => {this.handleInput(this.state.players[5],this.state.player6Input);}}>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                        {/*Player 7*/}
                        {this.state.players.length>=7 ? (
                        <Player style={{marginTop:"2%", marginRight:"2%", float:"right"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>{this.state.guessedCards[6]}</GuessedCardsField>
                            <ScoreField>{this.state.scores[6]}</ScoreField>
                            {this.state.players[6] !== this.state.activePlayer ?
                                <NameField>7. {this.state.players[6]}</NameField> :
                                <NameFieldActivePlayer>7. {this.state.players[6]}</NameFieldActivePlayer>}
                            <InputField>
                                {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[6])) || this.state.phaseNumber === 4 ? (
                                    <Output id={"clue7"}></Output>
                                ):(
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player7Input', e.target.value);}}/>)
                                }
                            </InputField>
                            <ReadyField id={"field7"} disabled={!this.state.player7Input}
                                        onClick={() => {this.handleInput(this.state.players[6],this.state.player7Input);}}>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                    </PlayerContainer>
                    <PlayerContainer>
                        {/*Player 1*/}
                        {this.state.players.length>=1 ? (
                        <Player style={{marginTop:"1%", marginLeft:"38%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>{this.state.guessedCards[0]}</GuessedCardsField>
                            <ScoreField>{this.state.scores[0]}</ScoreField>
                            {this.state.players[0] !== this.state.activePlayer ?
                                <NameField>1. {this.state.players[0]}</NameField> :
                                <NameFieldActivePlayer>1. {this.state.players[0]}</NameFieldActivePlayer>}
                            <InputField>
                                {(this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[0])) || this.state.phaseNumber === 4 ? (
                                    <Output id={"clue1"}></Output>
                                ):(
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player1Input', e.target.value);}}/>)
                                }
                            </InputField>
                            <ReadyField id={"field1"} disabled={!this.state.player1Input}
                                        onClick={() => {this.handleInput(this.state.players[0],this.state.player1Input);}}>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
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
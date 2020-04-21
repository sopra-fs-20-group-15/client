import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
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
  
  // z-index: -1;
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
  // top: 5%;
  // left: 12%;
  
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
            mysteryWord: null,
            players: [],
            activePlayer: null,
            passivePlayers: [],
            passivePlayersCluesGiven: [],
            clues: [],
            guess: null,
            validGuess: false,
            scores: null,
            timer: null,
            //frontend variables
            clueNumber: null,
            round: 1,
            phaseNumber: 1,
            phases: ["Choose Number", "Write Clues", "Guess Word", "Word Reveal"],
            remainingCards: 13,
            guessedCards: 0,
            player1Input: null,
            player2Input: null,
            player3Input: null,
            player4Input: null,
            player5Input: null,
            player6Input: null,
            player7Input: null
        };
        // some error here...
        this.interval = setInterval(this.handlePolling, 500);
        this.handlePolling = this.handlePolling.bind(this);
    }

    //clears previous phase and sets up the new one (like resetting input, timer and other stuff) NOT FINISHED YET
/*    switchPhase() {
        if (this.state.phaseNumber == 4) { this.setState({round: this.state.round+1}); }
        let nextPhase = [2,3,4,1];
        let nextTimer = [45,45,15,15];
        this.switchPhaseHUD(this.state.phaseNumber);
        this.setState({
            phaseNumber: nextPhase[this.state.phaseNumber-1],
            secondsLeft: nextTimer[this.state.phaseNumber-1]
        });

    }*/

    async initializeTurn() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token')
            });

            console.log('turn initialized');

            await api.put('/games/' + this.state.gameId + '/initializations', requestBody);
        } catch (error) {
            alert(`Something went wrong while initializing the Turn: \n${handleError(error)}`);
        }
    }

    async getCard() {
        try {
            // this.initializeTurn();
            /** The active card is fetch (already set by initializeTurn()), it's words are saved and displayed
             * (for the passive players). The stack of remaining cards is updated. */
            const response = await api.get('/games/' + this.state.gameId + '/cards/' + localStorage.getItem('token'));

            // console.log('current card', response);

            if (response.status === 200 && response.data.words !== this.state.currentCard) {
                this.setState({
                    currentCard: response.data.words
                })
            }

            // console.log('state after drawing card', this.state);

            /** Button disappears and card is displayed after card is drawn. We use an if-statement to make sure
             * that these actions are only executed if the currentCard variable has actually been given a list of
             * five words. This is needed because the passive players will call this method on a regular interval
             * (polling) and often the card has not been drawn yet. */
            if (response.data.words.length === 5) {
                document.getElementById("drawCard").style.display = "none";
                document.getElementById("activeCard").style.display = "block";
            }

        } catch (error) {
        }
    }

    async determineMysteryWord(wordId) {
        try {
            /** Checking for valid input (not just in backend) */
            if (1 <= wordId <= 5) {
                const requestBody = JSON.stringify({
                    wordId: wordId,
                    playerToken: localStorage.getItem('token')
                });

                const response = await api.put('/games/' + this.state.gameId + "/mysteryWord", requestBody);

                console.log('response from determining mystery word', response);

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
        } catch (error) {
            alert(`Something went wrong while determining the Mystery Word: \n${handleError(error)}`)
        }
    }

    async getMysteryWord() {
        try {
            const response = await api.get('/games/'+this.state.gameId+"/mysteryWord/"+localStorage.getItem('token'));

            // console.log('mystery word', response);

            if (response.status === 200) {
                this.setState({
                    mysteryWord: response.data.word
                });
            }

            // console.log('state after getting mystery word', this.state)

            for (let i = 0; i < this.state.currentCard.length; i++) {
                if (this.state.mysteryWord !== this.state.currentCard[i]) {
                    let lineThroughWord = document.getElementById("word" + (i + 1));
                    lineThroughWord.style.textDecoration = "line-through";
                }
            }
        } catch (error) {

        }
    }

    async giveClue(clue) {
        try {
            const requestBody = JSON.stringify({
                clue: clue,
                playerToken: localStorage.getItem('token')
            });

            console.log('requestBody for giving clue', requestBody);

            const response = await api.post('/games/' + this.state.gameId + "/clues", requestBody);

            console.log('response from giving clue', response);

            // this.setState({
            //     currentCard: response.data,
            //     remainingCards: this.state.remainingCards-1
            // });
        } catch (error) {
            alert(`Something went wrong while trying to give the Clue: \n${handleError(error)}`)
        }
    }

    async getValidClues() {
        try {
            const response = await api.get('/games/' + this.state.gameId + '/clues/' + localStorage.getItem('token'));

            // console.log('valid clues', response);

            if (response.status === 200) {
                this.setState({
                    clues: response.data.listOfClues
                });
            }

            console.log('is this the solution?', response.data);

        } catch (error) {
            alert(`Something went wrong while getting the valid Clues: \n${handleError(error)}`);
        }
    }

    async setGuess(guess) {
        try {
            const requestBody = JSON.stringify({
                guess: guess,
                playerToken: localStorage.getItem('token')
            });

            console.log('requestBody setGuess', requestBody);

            const response = await api.post('/games/'+this.state.gameId+"/guesses", requestBody);

            console.log('response from giving guess', response);
        } catch (error) {
            alert(`Something went wrong while giving the Guess: \n${handleError(error)}`);
        }
    }

    async getGuess() {
        try {
            console.log('resolveGuess');

            const response = await api.get('/games/' + this.state.gameId + '/guesses/' + localStorage.getItem('token'));

            // console.log('guess', response);

            if (response.status === 200) {
                this.setState({
                    guess: response.data.guess,
                    validGuess: response.data.isValidGuess
                });
            }

            // console.log('state after guess', this.state);

        } catch (error) {
            alert(`Something went wrong while getting the Guess: \n${handleError(error)}`);
        }
    }

    async checkGameEnded() {
        try {
        } catch (error) {
            alert(`Something went wrong while checking the Games State: \n${handleError(error)}`);
        }
    }

    async getScores() {
        try {

        } catch (error) {
            alert(`Something went wrong while getting the Scores: \n${handleError(error)}`);
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

            if (response.status === 200) {
                this.setState({
                    passivePlayersCluesGiven: response.data
                });
            }

        } catch (error) {
            alert(`Something went wrong while IM DEAD INSIDE: \n${handleError(error)}`);
        }
    }

    async getPlayers() {
        const response = await api.get('/activeGames/' + localStorage.getItem('gameId'));

        this.setState({
            gameId: localStorage.getItem('gameId'),
            players: response.data.playerNames,
            activePlayer: response.data.activePlayerName,
            passivePlayers: response.data.passivePlayerNames
        });
    }

    /** This method makes sure that the input given by the different players is triggers the corresponding effects
     * based on the role of the player (active or passive player) and the phase number (between 1 and 3, in phase 4
     * no input is taken). */
    handleInput(playerName, input) {
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
                this.giveClue();
            }
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

    //I try to use this method to fix the timer issue
    switchPhase() {
        let nextTimer = [15,25,30,10];
        if (this.state.phaseNumber === 4) {
            this.setState({
                round: this.state.round + 1,
                phaseNumber: 1,
                timer: nextTimer[1]
            });
            // this.initializeTurn()
        } else {
            this.setState({
                phaseNumber: this.state.phaseNumber + 1,
                timer: nextTimer[this.state.phaseNumber + 1]
            });
        }
        this.updatePhaseHUD(this.state.phaseNumber);
    }

    updatePhase() {
        let nextTimer = [15,25,30,10];
        /** Only Phase 4 has always a guess that's not empty */
        if (this.state.guess !== null) {
            /** if it is not Phase 4, change to 4 and reset Timer */
            if (this.state.phaseNumber !== 4) {
                this.setState({
                    phaseNumber: 4,
                    timer: nextTimer[3]
                });
                this.updatePhaseHUD(4);
            }
        }
        /** Not possible to test if it should be Phase 3 so here's a Placeholder */
        else if (this.state.passivePlayersCluesGiven.length === this.state.passivePlayers.length) {
            if (this.state.phaseNumber !== 3) {
                this.setState({
                    phaseNumber: 3,
                    timer: nextTimer[2]
                });
                this.updatePhaseHUD(3);
            }
        }

        /** Only Phase 2 has always a chosen Mystery Word */
        else if (this.state.mysteryWord !== null) {
            if (this.state.phaseNumber !== 2) {
                this.setState({
                    phaseNumber: 2,
                    timer: nextTimer[1]
                });
                this.updatePhaseHUD(2);
            }
        }
        /** Only Phase 1 has always none of these above*/
        else if (this.state.currentCard !== []) {
            if (this.state.phaseNumber !== 1) {
                this.setState({
                    phaseNumber: 1,
                    timer: nextTimer[0]
                });
                this.updatePhaseHUD(1);
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

    /** This method makes sure that a player's page is updated correctly based on the role of the player (active
     * or passive player) and the phase number (between 1 and 4). */
    handlePolling = async () => {
        try {
            // console.log('polling is done');
            // console.log('by', localStorage.getItem('username'));
            this.updatePhase();
            if (this.state.phaseNumber === 1) {
                // console.log('gets in phase 1');
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    // console.log('gets in active player')
                    this.getCard();
                    this.getMysteryWord();
                    this.getPlayers();
                    this.getValidClues();
                    this.getCluePlayers();
                }
                if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                    // console.log('gets in passive players');
                    this.getCard();
                    this.getMysteryWord();
                    this.getPlayers();
                    this.getValidClues();
                    this.getCluePlayers();
                }
            } else if (this.state.phaseNumber === 2) {
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    this.getCard();
                    this.getMysteryWord();
                    this.getPlayers();
                    this.getValidClues();
                    this.getCluePlayers();
                }
                if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                    this.getCard();
                    this.getMysteryWord();
                    this.getPlayers();
                    this.getValidClues();
                    this.getCluePlayers();
                }
            } else if (this.state.phaseNumber === 3) {
                if (localStorage.getItem('username') === this.state.activePlayer) {
                    // does not need to do anything since getting the guess is coupled to button clicking for the active player
                    this.getCard();
                    this.getMysteryWord();
                    this.getPlayers();
                    this.getValidClues();
                    this.getCluePlayers();
                    // this.getGuess();

                    console.log('cluePlayers',this.state.passivePlayersCluesGiven);
                    console.log('getGuess',this.state.guess);
                    console.log('GuessValidity',this.state.validGuess);
                    console.log('ValidClues', this.state.clues);

                }
                if (this.state.passivePlayers.includes(localStorage.getItem('username'))) {
                    this.getCard();
                    this.getMysteryWord();
                    this.getPlayers();
                    this.getValidClues();
                    this.getCluePlayers();
                    // this.getGuess();

                    console.log('cluePlayers',this.state.passivePlayersCluesGiven);
                    console.log('getGuess',this.state.guess);
                    console.log('GuessValidity',this.state.validGuess);
                    console.log('ValidClues', this.state.clues);

                }
            } else if (this.state.phaseNumber === 4) {
                this.getCard();
                this.getMysteryWord();
                this.getValidClues();
                // this.getGuess();
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

            //right place?
            //this.initializeTurn();

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
                            <Timer seconds={this.state.timer}/>
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
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>2</GuessedCardsField>
                            <ScoreField>969</ScoreField>
                            {this.state.players[1] !== this.state.activePlayer ?
                                <NameField>2. {this.state.players[1]}</NameField> :
                                <NameFieldActivePlayer>2. {this.state.players[1]}</NameFieldActivePlayer>}
                            <InputField>
                                {this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[1]) ? (
                                    <Output>{this.state.player2Input}</Output>
                                ):(
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player2Input', e.target.value);}}/>)
                                }
                            </InputField>
                            <ReadyField disabled={!this.state.player2Input}
                                        onClick={() => {this.handleInput(this.state.players[1],this.state.player2Input);}}>
                                <p hidden={!this.state.player2Input}>...</p>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                        {/*Player 3*/}
                        {this.state.players.length>=3 ? (
                        <Player style={{marginTop:"-8%", marginRight:"20%", float:"right"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>0</GuessedCardsField>
                            <ScoreField>9</ScoreField>
                            {this.state.players[2] !== this.state.activePlayer ?
                                <NameField>3. {this.state.players[2]}</NameField> :
                                <NameFieldActivePlayer>3. {this.state.players[2]}</NameFieldActivePlayer>}
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('player3Input', e.target.value);}}/>
                            </InputField>
                            <ReadyField disabled={!this.state.player3Input}
                                        onClick={() => {this.handleInput(this.state.players[2],this.state.player3Input);}}>
                                <p hidden={!this.state.player3Input}>...</p>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                    </PlayerContainer>
                    {/*Second Player Row*/}
                    <PlayerContainer>
                        {/*Player 4*/}
                        {this.state.players.length>=4 ? (
                        <Player style={{marginTop:"2%", marginLeft:"0%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            {this.state.players[3] !== this.state.activePlayer ?
                                <NameField>4. {this.state.players[3]}</NameField> :
                                <NameFieldActivePlayer>4. {this.state.players[3]}</NameFieldActivePlayer>}
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('player4Input', e.target.value);}}/>
                            </InputField>
                            <ReadyField disabled={!this.state.player4Input}
                                        onClick={() => {this.handleInput(this.state.players[3],this.state.player4Input);}}>
                                <p hidden={!this.state.player4Input}>...</p>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                        {/*Player 5*/}
                        {this.state.players.length>=5 ? (
                            <Player style={{marginTop:"2%", marginRight:"0%", float:"right"}}>
                                <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                                <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                                <ScoreField></ScoreField>
                                {this.state.players[4] !== this.state.activePlayer ?
                                    <NameField>5. {this.state.players[4]}</NameField> :
                                    <NameFieldActivePlayer>5. {this.state.players[4]}</NameFieldActivePlayer>}
                                <InputField>
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player5Input', e.target.value);}}/>
                                </InputField>
                                <ReadyField disabled={!this.state.player5Input}
                                            onClick={() => {this.handleInput(this.state.players[4],this.state.player5Input);}}>
                                    <p hidden={!this.state.player5Input}>...</p>
                                </ReadyField>
                            </Player>
                        ): (<Player/>)}
                    </PlayerContainer>
                    {/*The GameBoard and its Content*/}
                    <TableContainer>
                        <Table>
                            <BoardContainer>
                                <GuessedCards style={{position:"absolute",left:"1.5%" ,bottom:"1%"}}></GuessedCards>
                                <GuessedCards style={{position:"absolute",left:"0.75%" ,bottom:"2%"}}></GuessedCards>
                                <GuessedCards style={{position:"absolute", bottom:"3%"}}> 3 </GuessedCards>
                                <Deck style={{position:"absolute", bottom:"1%", left:"20%"}}></Deck>
                                <Deck style={{position:"absolute", bottom:"2%", left:"19%"}}></Deck>
                                <Deck style={{position: "absolute", bottom: "3%", left: "18%"}}>
                                    <DrawCard id={"drawCard"} onClick={() => this.initializeTurn()}> Draw Card! </DrawCard>
                                    {this.state.remainingCards}
                                </Deck>
                                {this.state.activePlayer !== localStorage.getItem('username') ? (
                                <ActiveCard id={"activeCard"} style={{display:"none"}}>
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
                                    <ActiveCard id={"activeCard"} style={{display:"none"}}>
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
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            {this.state.players[5] !== this.state.activePlayer ?
                                <NameField>6. {this.state.players[5]}</NameField> :
                                <NameFieldActivePlayer>6. {this.state.players[5]}</NameFieldActivePlayer>}
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('player6Input', e.target.value);}}/>
                            </InputField>
                            <ReadyField disabled={!this.state.player6Input}
                                        onClick={() => {this.handleInput(this.state.players[5],this.state.player6Input);}}>
                                <p hidden={!this.state.player6Input}>...</p>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                        {/*Player 7*/}
                        {this.state.players.length>=7 ? (
                        <Player style={{marginTop:"2%", marginRight:"2%", float:"right"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            {this.state.players[6] !== this.state.activePlayer ?
                                <NameField>7. {this.state.players[6]}</NameField> :
                                <NameFieldActivePlayer>7. {this.state.players[6]}</NameFieldActivePlayer>}
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('player7Input', e.target.value);}}/>
                            </InputField>
                            <ReadyField disabled={!this.state.player7Input}
                                        onClick={() => {this.handleInput(this.state.players[6],this.state.player7Input);}}>
                                <p hidden={!this.state.player7Input}>...</p>
                            </ReadyField>
                        </Player>
                        ): (<Player/>)}
                    </PlayerContainer>
                    <PlayerContainer>
                        {/*Player 1*/}
                        {this.state.players.length>=1 ? (
                        <Player style={{marginTop:"1%", marginLeft:"38%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            {this.state.players[0] !== this.state.activePlayer ?
                                <NameField>1. {this.state.players[0]}</NameField> :
                                <NameFieldActivePlayer>1. {this.state.players[0]}</NameFieldActivePlayer>}
                            <InputField>
                                {this.state.phaseNumber === 3 && this.state.passivePlayers.includes(this.state.players[0]) ? (
                                    <Output>{this.state.player1Input}</Output>
                                ):(
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('player1Input', e.target.value);}}/>)
                                }
                            </InputField>
                            <ReadyField disabled={!this.state.player1Input}
                                        onClick={() => {this.handleInput(this.state.players[0],this.state.player1Input);}}>
                                <p hidden={!this.state.player1Input}>...</p>
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
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 420px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
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
            remainingCards: 13,
            guessedCards: 0,
            currentCard: ["Motherfucker", "Volvo", "Marmite", "Furry", "Camper"],
            mysteryWord: null,
            phaseNumber: 1,
            phases: ["Choose Number", "Write Clues", "Guess Word", "Word Reveal"],
            round: 1,
            // temporary list of strings and active player (for test purpose)
            players: ["john", "Minh", "george", "richard"],
            activePlayer: "Minh",
            passivePlayers: null,
            clueNumber: null,
            clues: null,
            guess: null,
            scores: null
        };
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

    //I try to use this method to fix the timer issue
    switchPhase() {
        this.switchPhaseHUD(this.state.phaseNumber);
        if (this.state.phaseNumber === 4) {
            this.setState({round: this.state.round + 1});
            this.setState({phaseNumber: 1});
        } else {
            this.setState({phaseNumber: this.state.phaseNumber + 1});
        }
    }

    switchPhaseHUD(id) {
        let greyPhase = document.getElementById("phase"+id);
        greyPhase.style.backgroundColor = "#817857";
        if (id != 4) {
            let greenPhase = document.getElementById("phase"+(id+1));
            greenPhase.style.backgroundColor = "#05FF00";
        } else {
            let greenPhase = document.getElementById("phase"+(1));
            greenPhase.style.backgroundColor = "#05FF00";
        }
    }

    async getNewCard() {
        try {
            //vlt noch ein check if deck has cards in it
            //gets a new card and decrease deck size by 1
            const response = await api.get('/games/'+this.state.gameId+"/cards/"+localStorage.getItem("token"));

            this.setState({
                currentCard: response.data,
                remainingCards: this.state.remainingCards-1
            });
        } catch (error) {
            alert(`Something went wrong while trying to get a new Card: \n${handleError(error)}`)
        }
    }

    async giveClue() {
        try {
            const requestBody = JSON.stringify({
                clue: this.state.clues,
                playerToken: this.props.match.params.id
            });

            const response = await api.post('/games/'+this.state.gameId+"/cards", requestBody);

            this.setState({
                currentCard: response.data,
                remainingCards: this.state.remainingCards-1
            });
        } catch (error) {
            alert(`Something went wrong while trying to get a new Card: \n${handleError(error)}`)
        }
    }

    //sets the mystery word and cross out all other words
    async setMysteryWord(wordId) {
        try {
            const requestBody = JSON.stringify({
                wordId: wordId,
                playerToken: localStorage.getItem("token")
            });

            const response = await api.post('/games/'+this.state.gameId+"/cards/", requestBody);
            this.setState({
                mysteryWord: response.data
            });

            var i;
            for (i=0 ; i<this.state.currentCard.length ; i++) {
                if (wordId-1 !== i) {
                    var lineThroughWord = document.getElementById("word"+(i+1));
                    lineThroughWord.style.textDecoration = "line-through";
                }
            }
        }
         catch (error) {
            alert(`Something went wrong while determine the Mystery Word: \n${handleError(error)}`)
        }
    }

    //handles the input of every player for each phase
    handleInput(playerName, input) {
        //actions of active player
        if (playerName === this.state.activePlayer) {
            if (this.state.phaseNumber === 1) {
                //choose mystery word
                this.switchPhase();
            }
            if (this.state.phaseNumber === 3) {
                //guess mystery word
                this.switchPhase();
            }
        }
        if (playerName in this.state.passivePlayers) {
            if (this.state.phaseNumber === 2) {
                //write clues
                if (this.state.clueNumber === this.state.passivePlayers.length) {
                    this.setState({clueNumber: 0});
                    this.switchPhase();
                } else {
                    this.setState({clueNumber: this.state.clueNumber+1});
                }
            }
        }
    }

    test() {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        this.props.history.push('/login');
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

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    // async componentDidMount() {
    //     try {
    //         // using a GET request we fetch a list of players
    //         const response = await api.get('/games/' + localStorage.getItem('gameId') + '/players');
    //
    //         // Get the returned players and update the state using the data from the GET request
    //         this.setState({ players: response.data });
    //     } catch (error) {
    //         alert(`Something went wrong while fetching the players: \n${handleError(error)}`);
    //     }
    // }

    async componentDidMount() {
        try {
            const response = await api.get('/activeGames/' + localStorage.getItem('gameId'));

            this.setState({
                gameId: response.data.id,
                players: response.data.playerNames,
                activePlayer: response.data.activPlayerName,
                passivePlayers: response.data.passivePlayerNames
            });
        } catch (error) {
            alert(`Something went wrong while fetching the players: \n${handleError(error)}`);
        }
    }

    render() {
        // this construction of the variable name for the different timer seconds helps us to render the timer dynamically
        let t = {};
        let a = 1;
        let b = 2;
        let c = 3;
        let d = 4;
        t['timer' + a] = 15;
        t['timer' + b] = 25;
        t['timer' + c] = 30;
        t['timer' + d] = 10;
        return (
                <Game>
                    {/*Timer and Phase*/}
                    <HUDContainer>
                        <TimerContainer>
                            <Round> Round {this.state.round} </Round>
                            <Timer seconds={t['timer' + this.state.phaseNumber]}/>
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
                        <Player style={{marginTop:"-8%", marginLeft:"20%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>2</GuessedCardsField>
                            <ScoreField>969</ScoreField>
                            <NameField>2. {this.state.players[1]}</NameField>
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('gameId', e.target.value);}}/>
                            </InputField>
                            <ReadyField disabled={!this.state.gameId}
                                        onClick={() => {this.handleInput(this.state.players[1],this.state.gameId);}}>
                                <p hidden={!this.state.gameId}>...</p>
                            </ReadyField>
                        </Player>
                        {/*Player 3*/}
                        <Player style={{marginTop:"-8%", marginRight:"20%", float:"right"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}>0</GuessedCardsField>
                            <ScoreField>9</ScoreField>
                            <NameField>3. {this.state.players[2].username !== null ? this.state.players[2].username : null}</NameField>
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('password', e.target.value);}}/>
                            </InputField>
                            <ReadyField disabled={!this.state.gameId}
                                        onClick={() => {this.test();}}>
                                <p hidden={!this.state.gameId}>...</p>
                            </ReadyField>
                        </Player>
                    </PlayerContainer>
                    {/*Second Player Row*/}
                    <PlayerContainer>
                        {/*Player 4*/}
                        <Player style={{marginTop:"2%", marginLeft:"0%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            <NameField>4. {this.state.players.length >= 4 ? this.state.players[3].username : null}</NameField>
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('password', e.target.value);}}/>
                            </InputField>
                            <ReadyField></ReadyField>
                        </Player>
                        {/*Player 5*/}
                        <Player style={{marginTop:"2%", marginRight:"0%", float:"right"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            <NameField>5. {this.state.players.length >= 5 ? this.state.players[4].username : null}</NameField>
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('password', e.target.value);}}/>
                            </InputField>
                            <ReadyField></ReadyField>
                        </Player>
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
                                <Deck style={{position:"absolute", bottom:"3%", left:"18%"}}> 7 </Deck>
                                <ActiveCard>
                                    {/* The words are only placeholders, as are the numbers */}
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
                            </BoardContainer>
                        </Table>
                    </TableContainer>
                    {/*Third Player Row*/}
                    <PlayerContainer>
                        {/*Player 6*/}
                        <Player style={{marginTop:"2%", marginLeft:"2%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            <NameField>6. {this.state.players.length >= 6 ? this.state.players[5].username : null}</NameField>
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('password', e.target.value);}}/>
                            </InputField>
                            <ReadyField></ReadyField>
                        </Player>
                        {/*Player 7*/}
                        <Player style={{marginTop:"2%", marginRight:"2%", float:"right"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            <NameField>7. {this.state.players.length === 7 ? this.state.players[6].username : null}</NameField>
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('password', e.target.value);}}/>
                            </InputField>
                            <ReadyField></ReadyField>
                        </Player>
                    </PlayerContainer>
                    <PlayerContainer>
                        {/*Player 1*/}
                        <Player style={{marginTop:"1%", marginLeft:"38%"}}>
                            <GuessedCardsField style={{top:"10%", left:"8%"}}></GuessedCardsField>
                            <GuessedCardsField style={{top:"5%", left:"12%"}}></GuessedCardsField>
                            <ScoreField></ScoreField>
                            <NameField>1. {this.state.players[0].username}</NameField>
                            <InputField>
                                <Input placeholder="Enter here.." onChange=
                                    {e => {this.handleInputChange('password', e.target.value);}}/>
                            </InputField>
                            <ReadyField></ReadyField>
                        </Player>
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
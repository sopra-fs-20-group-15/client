import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';

//margin padding stuff:
//percentage for values relative to the browser
//absolute for absolute values

const GuessedCards = styled.div`
  width: 80px;
  height: 110px;
  
  position: absolute;
  bottom: 3%;

  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  font-size: 50px;
  font-weight: bold;
  text-align: center;
  line-height: 110px;
  color: #52ff02;
`;

const Deck = styled.div`
  width: 170px;
  height: 230px;
  
  position: absolute;
  bottom: 3%;
  left: 18%;

  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  font-size: 100px;
  font-weight: bold;
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
`;

const First = styled.div`
    position: absolute;
    padding: 4px 0;
    height: 30px;
    width: 10%;
    margin-left: 8px;
    margin-right: auto;
    
    font-family: Happy Monkey;
    font-size: 20px;
    color: #00CDCD;
    
    top: 17.5px;
`;

const Second = styled.div`
    position: absolute;
    padding: 4px 0;
    height: 30px;
    width: 10%;
    margin-left: 8px;
    margin-right: auto;
    
    font-family: Happy Monkey;
    font-size: 20px;
    color: #42c202;
    
    top: 65px;
`;

const Third = styled.div`
    position: absolute;
    padding: 4px 0;
    height: 30px;
    width: 10%;
    margin-left: 8px;
    margin-right: auto;
    
    font-family: Happy Monkey;
    font-size: 20px;
    color: #db3d3d;
    
    top: 112.5px;
`;

const Forth = styled.div`
    position: absolute;
    padding: 4px 0;
    height: 30px;
    width: 10%;
    margin-left: 8px;
    margin-right: auto;
    
    font-family: Happy Monkey;
    font-size: 20px;
    color: #fc9229;
    
    top: 160px;
`;

const Fifth = styled.div`
    position: absolute;
    padding: 4px 0;
    height: 30px;
    width: 10%;
    margin-left: 8px;
    margin-right: auto;
    
    font-family: Happy Monkey;
    font-size: 20px;
    color: #ffe203;
    
    top: 207.5px;
`;

const FirstWord = styled.div`
    position: relative;
    padding: 5px 0;
    height: 30px;
    width: 80%;
    margin-left: 30px;
    margin-right: auto;
    
    border-style: solid;
    border-color: #00CDCD;
    
    font-family: Happy Monkey;
    font-size: 15px;
    justify-content: center;
    display: flex;
    
    top: 17.5px;
`;

const SecondWord = styled.div`
    position: relative;
    padding: 5px 0;
    height: 30px;
    width: 80%;
    margin-left: 30px;
    margin-right: auto;
    
    border-style: solid;
    border-color: #42c202;
    
    font-family: Happy Monkey;
    font-size: 15px;
    justify-content: center;
    display: flex;
    
    top: 35px;
`;

const ThirdWord = styled.div`
    position: relative;
    padding: 5px 0;
    height: 30px;
    width: 80%;
    margin-left: 30px;
    margin-right: auto;
    
    border-style: solid;
    border-color: #db3d3d;
    
    font-family: Happy Monkey;
    font-size: 15px;
    justify-content: center;
    display: flex;
    
    top: 52.5px;
`;

const ForthWord = styled.div`
    position: relative;
    padding: 5px 0;
    height: 30px;
    width: 80%;
    margin-left: 30px;
    margin-right: auto;
    
    border-style: solid;
    border-color: #fc9229;
    
    font-family: Happy Monkey;
    font-size: 15px;
    justify-content: center;
    display: flex;
    
    top: 70px;
`;

const FifthWord = styled.div`
    position: relative;
    padding: 5px 0;
    height: 30px;
    width: 80%;
    margin-left: 30px;
    margin-right: auto;
    
    border-style: solid;
    border-color: #ffe203;
    
    font-family: Happy Monkey;
    font-size: 15px;
    justify-content: center;
    display: flex;
    
    top: 87.5px;
`;

//The position of ActiveCard, Deck and GuessedCards are relative to BoardContainer
//because of line 57,43
const BoardContainer = styled.div`
  width: 550px;
  height: 300px;
  display: inline-block;
  
  position: relative;

  // border: 3px solid #000000;
  // box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
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
  
  //determines the layer of the div component (-1 = background)
  z-index: -1;
  
  background: linear-gradient(180deg, #005C0F 0%, rgba(0, 147, 23, 0) 100%), #05F400;
`;

const Timer = styled.div`
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

//Player 2
const TopLeftPlayer = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  
  margin-top: -8%;
  margin-left: 20%;
  
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;

//Player 3
const TopRightPlayer = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  float: right;
  
  margin-top: -8%;
  margin-right: 20%;
  
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;

//Player 4
const MidLeftPlayer = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  
  margin-top: 2%;
  margin-left: 0%;
  
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;

//Player 5
const MidRightPlayer = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  float: right;
  
  margin-top: 2%;
  margin-right: 0%;
  
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;

//Player 6
const MidLeftPlayer2 = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  
  margin-top: 2%;
  margin-left: 3%;
  
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;

//Player 7
const MidRightPlayer2 = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  float: right;
  
  margin-top: 2%;
  margin-right: 3%;
  
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;

const PlayerDiv = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  float: right;
    
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;

//Player 1
const BottomPlayer = styled.div`
  width: 350px;
  height: 130px;
  
  margin-top: 2%;
  margin: 0 auto;
  
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;


const PlayerContainer = styled.div`
`;

const Table = styled.div`
  width: 1000px;
  height: 500px;
  border-radius: 1000px/500px;
  
  margin-top: -250px;
  margin-bottom: -200px;
  
  align-items: center;
  justify-content: center;
  display: fix;
  
  background: linear-gradient(180deg, #CF7C00 0%, rgba(147, 88, 0, 0.0302086) 96.98%, rgba(114, 68, 0, 0) 100%), #773900;
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
  
  z-index: -1;
`;


const TableContainer = styled.div`
  display: fix;
  align-items: center;
  justify-content: center;
  //allows player HUD to overlap the Table (ich bin so ein genius guy)
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

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
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

const Seconds = styled.div`
    position: absolute;
    top: 60px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-family: Happy Monkey;
    font-size: 70px;
    justify-content: center;
    display: flex;
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

const Phase1Circle = styled.div`
    position: absolute;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: #05FF00;
    left: 26px;
    top: 20px;
`;

const Phase2Circle = styled.div`
    position: absolute;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: #817857;
    left: 82px;
    top: 20px;
`;

const Phase3Circle = styled.div`
    position: absolute;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: #817857;
    left: 138px;
    top: 20px;
`;

const Phase4Circle = styled.div`
    position: absolute;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: #817857;
    left: 194px;
    top: 20px;
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
    constructor() {
        super();
        this.state = {
            // username: null,
            // password: null
        };
    }
    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end
     * and its token is stored in the localStorage.
     */
    // async login() {
    //     try {
    //         const requestBody = JSON.stringify({
    //             username: this.state.username,
    //             password: this.state.password,
    //         });
    //         const response = await api.put( '/login', requestBody);
    //
    //         // Store the token into the local storage.
    //         localStorage.setItem('token', response.data.token);
    //         localStorage.setItem('id', response.data.id);
    //
    //         // Login successfully worked --> navigate to the route /game in the GameRouter
    //         this.props.history.push(`/overview`);
    //     } catch (error) {
    //         alert(`Something went wrong during the login: \n${handleError(error)}`);
    //     }
    // }

    // async register(){
    //     try{
    //         this.props.history.push("/register")
    //     } catch (error){
    //         alert ("Something went wrong while trying to return to the registration screen")
    //     }
    // }

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
    componentDidMount() {}

    render() {
        return (
                <Game>
                    {/*Timer and Phase*/}
                    <HUDContainer>
                        <Timer>
                            {/*Placeholders -> will need props!*/}
                            <Round> Round 13 </Round>
                            <Seconds> 30 </Seconds>
                        </Timer>
                        <Phase>
                            <Phase1Circle/>
                            <Phase2Circle/>
                            <Phase3Circle/>
                            <Phase4Circle/>
                            {/* need props here, just placeholder for now*/}
                            <PhaseMessage> Choose Number </PhaseMessage>
                        </Phase>
                    </HUDContainer>
                    {/*First Player Row*/}
                    <PlayerContainer>
                        <TopLeftPlayer></TopLeftPlayer>
                        <TopRightPlayer></TopRightPlayer>
                    </PlayerContainer>
                    {/*Second Player Row*/}
                    <PlayerContainer>
                        <MidLeftPlayer></MidLeftPlayer>
                        <MidRightPlayer></MidRightPlayer>
                    </PlayerContainer>
                    {/*The GameBoard and its Content*/}
                    <TableContainer>
                        <Table>
                            <BoardContainer>
                            <GuessedCards> 3 </GuessedCards>
                            <Deck> 7 </Deck>
                            <ActiveCard>
                                {/* The words are only placeholders, as are the numbers */}
                                <First> 1. </First>
                                <FirstWord> Chocolate </FirstWord>
                                <Second> 2. </Second>
                                <SecondWord> Barbie </SecondWord>
                                <Third> 3. </Third>
                                <ThirdWord> Marmite </ThirdWord>
                                <Forth> 4. </Forth>
                                <ForthWord> Motherfucker </ForthWord>
                                <Fifth> 5. </Fifth>
                                <FifthWord> Weather forecast </FifthWord>
                            </ActiveCard>
                            </BoardContainer>
                        </Table>
                    </TableContainer>
                    {/*Third Player Row*/}
                    <PlayerContainer>
                        <MidLeftPlayer2></MidLeftPlayer2>
                        <PlayerDiv style={{marginTop:"2%", marginLeft:"3%"}}></PlayerDiv>
                    </PlayerContainer>
                    <PlayerContainer>
                        <BottomPlayer></BottomPlayer>
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
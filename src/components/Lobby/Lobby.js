import React, {Fragment} from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import JustOneLogo from "../../views/pictures/JustOneLogo.png";
import TriangleBackground from '../../views/pictures/TriangleBackground.png'


const GridItemTitle = styled.div`
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;
  font-weight: bold;
  text-decoration: underline;
  text-transform: uppercase;
  text-align: center;
  justify-content: center;
  align-items: center;
  // display: flex;
  text-decoration-skip-ink: none;
  border-bottom: 3px solid;
  height: 65px;
  
  padding-top: 2px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GridNormalItem = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  // display: flex;
  font-family: Happy Monkey;
  font-size: 22px;
  border-bottom: 2.50px solid;
  height: 55px;
  
  padding-top: 13px;
  padding-left: 10px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatMessageContainer = styled.div`
  left: 2%;
  width: 98%;
  position: relative;
`;

const ChatMessage = styled.div`
  font-size: 16px;
  font-family: Happy Monkey;
  position: relative;
  display: inline-block;
`;

const UIContainer = styled.div`
  height: 350px;
  width: 800px;
  position: absolute;
  
  left: 21%
  top: 33%;
  bottom: 20%;
  
`;

const ChatContainer = styled.div`
  background-color: #ECDD8F;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  max-height: 350px;
  display: inline-block;
  height: 350px;
  width: 400px;
  
  overflow-y: auto;
  right: 0%;
  
  border: 3px solid;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 300px;
  background-color: #BDAF7E;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  height: 350px;
  width: 400px;
  display: inline-block;
  
  overflow-y: auto;
  
  border: 3px solid;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const ButtonGroup = styled.div`
  position: absolute;
  bottom: 10%;
  left: 30%;
  right: 30%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const InputField = styled.input`
  &::placeholder {
    font-family: Happy Monkey;
    color: rgba(0, 0, 0, 0.5);
  }
  position: absolute;
  width: 96%;
  height: 40px;
  background: rgba(203, 189, 140, 0.54);
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  border-color: rgba(203, 189, 140, 0.54);
  font-family: Happy Monkey;
  position: absolute;
  bottom: 8px;
  left: 2%;
`;

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

class Lobby extends React.Component {
    constructor() {
        super();
        this.state = {
            activeGameId: null,
            gameSetUpId: null,
            gameName: null,
            hostName: null,
            players: [""],
            desiredPlayers: null,
            actualPlayers: null,
            angels: null,
            devils: null,
            chatMessages: [{playerName: "SlyLooter", message: "Suck my balls! You fucking twat! Lick my hairy balls!"}, {playerName: "Slatki", message: "No you!"}, {playerName: "Meridia", message: "Let's just have fun!"}],
            colors: ["#0A7E00", "#0C3BE8", "#FF1201", "#E8750C", "#9B03DD", "#00b9b8", "#FF01A1"]
        };

        this.interval = setInterval(this.getInfos, 500);
        this.getInfos = this.getInfos.bind(this);
    }

    getInfos = async () => {
        try {
            const response = await api.get('/games/lobbies/' + this.props.match.params.id + "/" + localStorage.getItem("token"));
            if (response.status === 200) {
                this.setState({
                    activeGameId: response.data.activeGameId,
                    gameSetUpId: response.data.gameSetUpId,
                    gameName: response.data.gameName,
                    hostName: response.data.hostName,
                    players: response.data.playerNames,
                    desiredPlayers: response.data.numOfDesiredPlayers,
                    actualPlayers: response.data.numOfActualPlayers,
                    angels: response.data.numOfAngels,
                    devils: response.data.numOfDevils
                });

                /** Making sure all users are redirected to the active game, after its creation (not just host).
                 * The token gameId makes sure that only the players from the lobby can join the game. */
                if (this.state.activeGameId) {
                    localStorage.setItem('gameId', this.state.activeGameId);
                    localStorage.setItem('GameGuard', this.state.activeGameId);
                    this.props.history.push('/gameLobby/' + this.state.activeGameId);
                }
            }
        } catch (error) {
            this.props.history.push('/lobbyOverview/')
        }
    };

    async startGame() {
        try {
            const requestBody = JSON.stringify({
                token: localStorage.getItem('token')
            });

            const response = await api.post('/games/'+this.props.match.params.id, requestBody);

            localStorage.setItem('GameGuard',response.data.id);
            this.props.history.push('/gameLobby/'+response.data.id);

        } catch (error) {
            alert(`Something went wrong while starting the Game: \n${handleError(error)}`);
        }
    }

    async leaveLobby() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token')
            });

            const response = await api.put('/games/'+this.props.match.params.id+'/lobbies/players', requestBody);

            this.props.history.push('/lobbyOverview');
        } catch (error) {
            alert(`Something went wrong while leaving the Lobby: \n${handleError(error)}`);
        }
    }

    async terminateGame() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token')
            });

            await api.delete('/gameSetUps/'+this.props.match.params.id, {data: requestBody});

            this.props.history.push('/lobbyOverview');
        } catch (error) {
            alert(`Something went wrong while terminating the game: \n${handleError(error)}`);
        }
    }

    async sendMessage() {

    }

    keyPressed(event) {
        if (event.key === "Enter") {
            this.sendMessage()
        }
    }

    //needs to gather info about the lobby!!!
    async componentDidMount() {
        try {
            this.getInfos();
        } catch(error) {
            alert(`Something went wrong while fetching the lobby's data: \n${handleError(error)}`);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <BaseContainer style={background}>
                <img className={"center"} src={JustOneLogo} alt={"JustOneLogo"}/>

                <UIContainer>
                    <GridContainer>
                        <GridItemTitle> {this.state.gameName} ({this.state.players.length}/{this.state.desiredPlayers})</GridItemTitle>
                        {this.state.players.map(user => {
                            return (
                                <Fragment key={user}>
                                    <GridNormalItem> {user} </GridNormalItem>
                                </Fragment>
                            )})}
                    </GridContainer>
                    <ChatContainer>
                        <div style={{position: "absolute", bottom: "60px"}}>
                            {this.state.chatMessages.map(chatMessage => {
                                return (
                                    <ChatMessageContainer>
                                        <ChatMessage> <span style={{color: this.state.colors[this.state.players.indexOf(localStorage.getItem('username'))]}}>{chatMessage.playerName}:</span> {chatMessage.message}</ChatMessage>
                                    </ChatMessageContainer>
                                )
                            })}
                        </div>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {this.handleInputChange('chatMessage', e.target.value)}}
                            onKeyPress={this.keyPressed}
                        />
                    </ChatContainer>
                </UIContainer>

                <ButtonGroup>
                    {/*Checks if the Player's token is equal to the Host's (but not yet tho)*/}
                    {localStorage.getItem('username') === this.state.hostName ? (
                        <ButtonContainer>
                            <Button
                                style={{width:"50%",marginRight:"10px"}}
                                onClick={() => {
                                    this.terminateGame(this.state.gameSetUpId);
                                }}>
                                Terminate Game
                            </Button>
                            <Button
                                style={{width:"50%",marginRight:"10px"}}
                                //check if enough players?
                                // disabled={!this.state.game}
                                // gameLobby is a temporary name
                                onClick={() => {
                                    this.startGame();
                                }}>
                                Start Game
                            </Button>
                        </ButtonContainer>
                    ):(
                        <ButtonContainer>
                            <Button
                                width="50%"
                                onClick={() => {
                                    this.leaveLobby();
                                }}>
                                Leave Lobby
                            </Button>
                        </ButtonContainer>
                    )}
                </ButtonGroup>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Lobby);
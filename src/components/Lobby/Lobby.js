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
  height: 58.3px;
  
  
  padding-top: 13px;
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
  height: 58.3px;
  
  padding-top: 13px;
  padding-left: 10px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatMessagesContainer = styled.div`
  position: absolute;
  bottom: 60px;
  height: 290px;
  overflow: scroll;
  padding-top: 12px;
`;

const ChatMessage = styled.div`
  left: 2%;
  width: 98%;
  position: relative;
  
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
  overflow-y: auto;
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

export function msToTime(duration) {
    let offset = new Date().getTimezoneOffset(),
        offsetMinutes = offset % 60,
        offsetHours = (offset/60) % 24;
    let minutes = Math.floor((duration / (1000 * 60)) % 60) - offsetMinutes,
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24) - offsetHours;

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    return hours + ":" + minutes;
}

class Lobby extends React.Component {
    constructor(props) {
        super(props);
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
            chatMessage: "",
            chatMessages: [],
            newMessages: true,
            colors: ["#0A7E00", "#0C3BE8", "#FF1201", "#E8750C", "#9B03DD", "#00b9b8", "#FF01A1"],
            deleted: false
        };

        this.intervalInfos = setInterval(this.getInfos, 500);
        this.intervalChat = setInterval(this.getChatMessages, 500);
        this.getInfos = this.getInfos.bind(this);
        this.getChatMessages = this.getChatMessages.bind(this);
        this.keyPressed = this.keyPressed.bind(this);

        this.messagesEndRef = React.createRef();
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
                    localStorage.removeItem('LobbyGuard');
                    localStorage.setItem('GameGuard', this.state.activeGameId);
                    this.props.history.push('/gameLobby/' + this.state.activeGameId);
                }
            }
        } catch (error) {

            if (!this.state.deleted) {
                this.setState({
                    deleted: true
                });
                localStorage.removeItem('LobbyGuard');
                this.props.history.push('/lobbyOverview/');

            }
        }
    };

    getChatMessages = async () => {
        try {

            const response = await api.get('/gameSetUps/'+ this.props.match.params.id +'/chatMessages/' + localStorage.getItem('token'));

            if (response.status === 200) {
                if (this.state.chatMessages.length !== (response.data.length)) {
                    this.setState({
                        chatMessages: response.data,
                        newMessages: true
                    });
                    this.scrollToBottom();
                } else {
                    this.setState({
                        newMessages: false
                    });
                }
            }

        } catch (error) {
            alert(`Something went wrong while retrieving the chat messages!`);
            console.log('error', handleError(error))
        }
    };

    async startGame() {
        try {
            const requestBody = JSON.stringify({
                token: localStorage.getItem('token')
            });

            const response = await api.post('/games/'+this.props.match.params.id, requestBody);

            localStorage.setItem('GameGuard',response.data.id);
            localStorage.removeItem('LobbyGuard');
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

            await api.put('/games/'+this.props.match.params.id+'/lobbies/players', requestBody);

            localStorage.removeItem('LobbyGuard');
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

            localStorage.removeItem('LobbyGuard');
            this.props.history.push('/lobbyOverview');
        } catch (error) {
            alert(`Something went wrong while terminating the game: \n${handleError(error)}`);
        }
    }

    async sendMessage() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token'),
                gameId: this.state.gameSetUpId,
                message: this.state.chatMessage
            });

            await api.post('/gameSetUps/chatMessages', requestBody);

        } catch (error) {

        }
    }

    keyPressed(e) {
        if (e.keyCode === 13) {
            console.log('message', this.state.chatMessage);
            this.sendMessage()
        }
    }

    handleInputChange(key, value) {
        this.setState({[key]: value});
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
    };

    async componentDidMount() {
        try {
            this.getInfos();
            this.getChatMessages();
            this.scrollToBottom();
        } catch(error) {
            alert(`Something went wrong while fetching the lobby's data: \n${handleError(error)}`);
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalInfos);
        clearInterval(this.intervalChat);
    }

    render() {
        return (
            <BaseContainer style={background}>
                {console.log('chattten', this.state.chatMessage)}
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
                        <ChatMessagesContainer>
                            {this.state.chatMessages.map(chatMessage => {
                                return (
                                    <ChatMessage id={"chatMessage"+this.state.chatMessages.indexOf(chatMessage)}>
                                        <span style={{color: this.state.colors[this.state.players.indexOf(localStorage.getItem('username'))]}}>({msToTime(chatMessage.time)}) {chatMessage.playerName}: </span>
                                        {chatMessage.message}</ChatMessage>
                                )
                            })}
                            <div style={{ float:"left", clear: "both" }}
                                 ref={this.messagesEndRef}>
                            </div>
                        </ChatMessagesContainer>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {this.handleInputChange('chatMessage', e.target.value)}}
                            onKeyDown={this.keyPressed}
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
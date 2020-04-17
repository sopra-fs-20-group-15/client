import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {Button, LogoutButton} from '../../views/design/Button';
import {withRouter} from 'react-router-dom';
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
  display: flex;
  text-decoration-skip-ink: none;
  outline-style: solid;
`;

const GridNormalItem = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  font-family: Happy Monkey;
  font-size: 24px;
  outline-style: solid;

`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 210px 133px 126px 150px auto;
  grid-gap: 3px 3px;
  background-color: #ECDD8F;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  grid-auto-rows: 74px;
  
  left: 316px;
  right: 316px;
  top: 260px;
  bottom: 200px;
  overflow-y: scroll;
  
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

/** The property z-index sets the stack order. Giving it a higher value than the rest (here 2) will make sure the
 * overlay is displayed in front of all other elements. */
const PasswordOverlayContainer = styled.div`    
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0; 
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  cursor: pointer;
  
  justify-content: center;
  align-items: center;

  z-index: 2;
`;

const PasswordContainer = styled.div`
  background-color: #ECDD8F;
  border-radius: 25px;
  border-style: solid;
  
  display: none;
  
  width: 350px;
  height: 158px;
  
  justify-content: center;
  align-items: center;
  
  font-family: Happy Monkey;
  font-size: 24px;
  
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 10px;
  
  /* needed for centering */
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%) }
  
  z-index: 3;
`;

const InputField = styled.input`
  &::placeholder {
    font-family: Happy Monkey;
    color: rgba(0, 0, 0, 0.5);
  }
  position: absolute;
  height: 40px;
  background: rgba(203, 189, 140, 0.54);
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  border-color: rgba(203, 189, 140, 0.54);
  font-family: Happy Monkey;
  font-size: 16px;
  
  
  width: 90%;
  left: 5%;
  top: 50px;
`;

const ErrorMessage = styled.div`
  grid-column-start: 1;
  grid-column-end: 6;
  grid-row-start: 2;
  grid-row-end: 5;
  
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  font-family: Happy Monkey;
  font-size: 40px;
`;

const BotContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 3px 3px;
  background-color: #000000;
  position: relative;
  
  box-sizing: border-box;
  outline-style: solid;
`;

const BotCell = styled.li`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  font-family: Happy Monkey;
  font-size: 24px;
`;

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

const ButtonGroup = styled.div`
  position: absolute;
  bottom: 5%;
  left: 30%;
  right: 30%;
`;

const LogoutButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 15px;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const OverlayButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  
  position: absolute
  top: 100px
  left: 5%
  width: 200px;
  
  /* needed for centering */
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%) }
`;

const ChooseGameContainer = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  outline-style: solid;
`;


class LobbyOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lobbies: null,
            chosenLobby: null,
            chosenLobbyIndex: null,
            password: null
        };

        this.interval = setInterval(this.getLobbies, 5000);
        this.getLobbies = this.getLobbies.bind(this);
    }


    async logout() {
        try {
            // token shows that user is logged in -> removing it shows that he has logged out
            localStorage.removeItem('token');

            // Logout successfully worked --> navigate to the route /login
            this.props.history.push(`/login`);
        } catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`)
        }

    }

    async joinPrivateLobby() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token'),
                password: this.state.password
            });

            const response = await api.put('/games/' + (this.state.chosenLobbyIndex+1) + '/players', requestBody);

            localStorage.setItem('gameId', response.data.gameId);

            this.props.history.push('/lobby/' + (this.state.chosenLobbyIndex+1))
        } catch (error) {
            alert(`Something went wrong while trying to join the lobby: \n${handleError(error)}`);
            this.props.history.push("/lobbyOverview")
        }
    }

    getLobbies = async () => {
        const response = await api.get('/games/lobbies');
        if (response.status === 200) {
            this.setState({
                lobbies: response.data
            })
        }
    };

    async joinLobby() {
        try {
            if (this.state.chosenLobby.gameType === "PUBLIC") {
                const requestBody = JSON.stringify({
                    playerToken: localStorage.getItem('token'),
                    password: ""
                });

                const response = await api.put('/games/' + (this.state.chosenLobbyIndex+1) + '/players', requestBody);

                localStorage.setItem('gameId', response.data.gameId);

                console.log('local gameid', localStorage.getItem('gameId'));

                this.props.history.push('/lobby/' + (this.state.chosenLobbyIndex+1))

            } else if (this.state.chosenLobby.gameType === "PRIVATE") {
                this.overlayOn();
            } else {
                alert('Something is wrong with the game type!');
            }
        } catch (error) {
            alert(`Something went wrong while trying to join the lobby: \n${handleError(error)}`);
            this.props.history.push("/lobbyOverview")
        }
    }

    async overlayOn() {
        document.getElementById("passwordContainer").style.display = "block";
        document.getElementById("passwordOverlay").style.display = "block";
    }

    async overlayOff() {
        document.getElementById("passwordContainer").style.display = "none";
        document.getElementById("passwordOverlay").style.display = "none";
    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        // making sure that the new number of players does not violate the constraints imposed by the game rules
        this.setState({[key]: value});
    }

    async componentDidMount() {
        try {
            this.getLobbies();
        } catch (error) {
            alert(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);
            this.props.history.push("/lobbyOverview")
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <BaseContainer style={background}>
                <PasswordOverlayContainer id={"passwordOverlay"} onClick={() => {this.overlayOff()}}/>
                <PasswordContainer id={"passwordContainer"}>
                    Password:
                    <InputField
                        id={"passwordInput"}
                        placeholder="Enter here.."
                        onChange={e => {
                            this.handleInputChange('password', e.target.value);
                        }}
                    />
                    <OverlayButtonContainer>
                        <Button
                            width="100%"
                            onClick={() => {this.joinPrivateLobby()}}
                        >
                            Confirm
                        </Button>
                    </OverlayButtonContainer>
                </PasswordContainer>
                <LogoutButtonContainer>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.logout();
                        }}
                    >
                        Logout
                    </LogoutButton>
                </LogoutButtonContainer>
                <img className={"center"} src={JustOneLogo} alt={"JustOneLogo"}/>
                {/** The first condition is needed if no game has been created yet. Before the GET request for the available
                 lobbies has been processed (takes a few milliseconds), this.state.lobbies equals null. After the request
                 has finished processing, this.state.lobbies now equals an empty array. Without the first condition an error
                 would occur, since the render() method would try to get the length of a null value (first phase, before
                 GET request has been processed).*/}
                {!this.state.lobbies || !(this.state.lobbies.length > 0) ? (
                    <GridContainer>
                        <GridItemTitle> Game </GridItemTitle>
                        <GridItemTitle> Private/ Public </GridItemTitle>
                        <GridItemTitle> Players </GridItemTitle>
                        <GridItemTitle> Bots </GridItemTitle>
                        <GridItemTitle> Choose Game </GridItemTitle>
                        <ErrorMessage>
                            There are no games available at the moment! Why don't you create one yourself, you lazy
                            fuck?
                        </ErrorMessage>
                    </GridContainer>
                ) : (
                    <GridContainer>
                        <GridItemTitle> Game </GridItemTitle>
                        <GridItemTitle> Private/ Public </GridItemTitle>
                        <GridItemTitle> Players </GridItemTitle>
                        <GridItemTitle> Bots </GridItemTitle>
                        <GridItemTitle> Choose Game </GridItemTitle>
                        {this.state.lobbies.map(lobby => {
                            return (
                                // using "Fragment" allows use to render multiple components in this function
                                <Fragment>
                                    <GridNormalItem> {lobby.gameName} </GridNormalItem>
                                    <GridNormalItem> {lobby.gameType} </GridNormalItem>
                                    <GridNormalItem> {lobby.numOfActualPlayers}/{lobby.numOfDesiredPlayers} </GridNormalItem>
                                    <BotContainer>
                                        <BotCell> Angels: {lobby.numOfAngels} </BotCell>
                                        <BotCell> Devils: {lobby.numOfDevils}</BotCell>
                                    </BotContainer>
                                    <ChooseGameContainer>
                                        {/** this.state.games.indexOf(game) identifies each game using its (unique) index in this.state.games */}
                                        <input type="radio" name="game" value={this.state.chosenLobby} onClick={() => {
                                            this.setState({chosenLobby: lobby});
                                            this.setState({chosenLobbyIndex: this.state.lobbies.indexOf(lobby)});
                                        }}/>
                                    </ChooseGameContainer>
                                </Fragment>
                            )
                        })}
                    </GridContainer>
                )}

                <ButtonGroup>
                    <ButtonContainer>
                        <Button
                            width="50%"
                            disabled={this.state.chosenLobby === null}
                            onClick={() => {this.joinLobby()}}
                        >
                            Join Lobby
                        </Button>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {
                                this.props.history.push('/createGame');
                            }}
                        >
                            Create Lobby
                        </Button>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {
                                this.props.history.push('/leaderboard');
                            }}
                        >
                            See Leaderboard
                        </Button>
                    </ButtonContainer>
                </ButtonGroup>
            </BaseContainer>
        );
    }
}

export default withRouter(LobbyOverview);

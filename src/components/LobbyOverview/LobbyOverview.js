import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {Button} from '../../views/design/Button';
import {withRouter} from 'react-router-dom';
import TriangleBackground from '../../views/pictures/TriangleBackground.png'
import PregameHeaderComponent from "../../views/PregameHeaderComponent";


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
  // display: flex;
  font-family: Happy Monkey;
  font-size: 24px;
  outline-style: solid;

  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns:195px 133px 126px 150px auto;
  grid-gap: 3px 3px;
  background-color: #ECDD8F;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  grid-auto-rows: 74px;
  
  left: 316px;
  right: 316px;
  top: 260px;
  bottom: 197px;
  overflow-y: auto;
  overflow-x: hidden;
  
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
            password: null
        };

        this.interval = setInterval(this.getLobbies, 1000);
        this.getLobbies = this.getLobbies.bind(this);
        this.goToRules = this.goToRules.bind(this);
    }

    /** Lets a player join a private lobby (called in joinLobby()) */
    async joinPrivateLobby() {
        try {
            const requestBody = JSON.stringify({
                playerToken: localStorage.getItem('token'),
                password: this.state.password
            });

            await api.put('/games/' + this.state.chosenLobby.id + '/players', requestBody);

            localStorage.setItem('LobbyGuard',this.state.chosenLobby.id);
            this.props.history.push('/lobby/' + this.state.chosenLobby.id);

        } catch (error) {
            console.log('Error in joinPrivateLobby()', handleError(error));
            if (error.response.status === 401) {
                alert('You typed in the wrong password!')
            }
            this.props.history.push("/lobbyOverview")
        }
    }

    /** Fetches all lobbies from the backend */
    getLobbies = async () => {
        const response = await api.get('/games/lobbies');
        if (response.status === 200) {
            this.setState({
                lobbies: response.data
            })
        }
    };

    /** Lets a player join a lobby */
    async joinLobby() {
        try {
            if (this.state.chosenLobby.gameType === "PUBLIC") {
                const requestBody = JSON.stringify({
                    playerToken: localStorage.getItem('token'),
                    password: ""
                });

                await api.put('/games/' + this.state.chosenLobby.id + '/players', requestBody);

                localStorage.setItem('LobbyGuard',this.state.chosenLobby.id);
                this.props.history.push('/lobby/' + this.state.chosenLobby.id);

            } else if (this.state.chosenLobby.gameType === "PRIVATE") {
                this.overlayOn();
            }
        } catch (error) {
            console.log('Error in joinLobby()', handleError(error));
            this.props.history.push("/lobbyOverview")
        }
    }

    /** If a player does not exist, this function makes sure that upon trying to enter the lobby overview page, the
     * player is redirected to the register screen */
    async sendToOblivion() {
        try {
            const response = await api.get('/players/tokens/'+ localStorage.getItem('token'));
        } catch(error) {
            console.log('Error in sendToOblivion()', handleError(error));
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            localStorage.removeItem('LobbyGuard');
            localStorage.removeItem('GameGuard');
            this.props.history.push("/register");
        }
    }

    /** Turns the password overlay on */
    async overlayOn() {
        document.getElementById("passwordContainer").style.display = "block";
        document.getElementById("passwordOverlay").style.display = "block";
    }

    /** Turns the password overlay off */
    async overlayOff() {
        document.getElementById("passwordContainer").style.display = "none";
        document.getElementById("passwordOverlay").style.display = "none";
    }

    /** Sets state according to input typed in input fields
     * @param: string key
     * @param: string value */
    handleInputChange(key, value) {
        this.setState({[key]: value});
    }

    async componentDidMount() {
        try {
            this.sendToOblivion();
            this.getLobbies();
        } catch (error) {
            console.log('Error in componentDidMount()', handleError(error));
            this.props.history.push("/lobbyOverview");
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    /** Redirects player to the tutorial page */
    async goToRules() {
        this.props.history.push("/tutorial")
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
                <PregameHeaderComponent from={"lobbyOverview"} history={this.props.history} loggedIn={true}/>
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
                            {(this.state.lobbies !== null ? "There are no games available at the moment! Why don't you create one yourself?" : "")}
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
                                /** "Fragment" allows use to render multiple div components as "one". */
                                // using "Fragment" allows use to render multiple components in this function
                                <Fragment>
                                    <GridNormalItem style={{paddingLeft:"10px",paddingTop:"22px"}}> {lobby.gameName} </GridNormalItem>
                                    <GridNormalItem style={{display:"flex"}}> {lobby.gameType} </GridNormalItem>
                                    <GridNormalItem style={{display:"flex"}}> {lobby.numOfHumanPlayers+lobby.numOfAngels+lobby.numOfDevils}/{lobby.numOfDesiredPlayers} </GridNormalItem>
                                    <BotContainer>
                                        <BotCell> Angels: {lobby.numOfAngels} </BotCell>
                                        <BotCell> Devils: {lobby.numOfDevils}</BotCell>
                                    </BotContainer>
                                    <ChooseGameContainer>
                                        <input type="radio" name="game" value={this.state.chosenLobby} onClick={() => {
                                            this.setState({chosenLobby: lobby});
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

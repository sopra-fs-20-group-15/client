import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button, LogoutButton } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import JustOneLogo from "../../views/JustOneLogo.png";
import TriangleBackground from '../../views/TriangleBackground.png'


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
`;

const GridNormalItem = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  font-family: Happy Monkey;
  font-size: 24px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 210px 133px 126px 150px auto;
  grid-gap: 3px 3px;
  background-color: #000000;
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

const BotContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 3px 3px;
  background-color: #000000;
  position: relative;
  
  box-sizing: border-box;
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

const ChooseGameContainer = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
`;


class LobbyOverview extends Component {
  constructor() {
    super();
    this.state = {
      lobbies: null,
      chosenLobby: null
    };
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

  async selectGame() {
    var radios = document.getElementsByName('name');

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        // do whatever you want with the checked radio
        console.log('checked', radios[i]);

        // only one radio can be logically checked, don't check the rest
        break;
      }
    }
  }

  async componentDidMount() {
       try {
            const response = await api.get('/games/lobbies');

            const lobbies = response.data;
            console.log('response', response);
            console.log('response data', response.data);

            this.setState({
              lobbies: lobbies
            })

       }    catch (error) {
            alert(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);
            this.props.history.push("/lobbyOverview")
       }
  }

  render() {
    return (
        <BaseContainer style={background}>
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
          {!this.state.lobbies ? (
              <GridContainer>
                <GridItemTitle> Game </GridItemTitle>
                <GridItemTitle> Private/ Public </GridItemTitle>
                <GridItemTitle> Players </GridItemTitle>
                <GridItemTitle> Bots </GridItemTitle>
                <GridItemTitle> Choose Game </GridItemTitle>
                <GridNormalItem> There are no games available at the moment! </GridNormalItem>
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
                         <input type="radio" name="game" value={this.state.lobbies.indexOf(lobby)} onClick={() => {this.setState({chosenLobby: this.state.lobbies.indexOf(lobby)})}}/>
                       </ChooseGameContainer>
                     </Fragment>
                 )})}
          </GridContainer>
              )}

          <ButtonGroup>
            <ButtonContainer>
              <Button
                  width="50%"
                  disabled={!this.state.chosenLobby}
                  onClick={() => {
                  }}
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

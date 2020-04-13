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
      games: [["ListenUp", "Private", 3, 4, 1, 2], ["HalfTheWorldAway", "Public", 1, 7, 0, 0], ["TheMasterplan", "Private", 2, 6, 0, 1], ["LiveForever", "Public", 2, 3, 3, 0]]
    };
  }



  async logout() {
    try {
      // eslint-disable-next-line

      const requestBody = JSON.stringify({
        token: localStorage.getItem("token"),
        id: localStorage.getItem("id"),
      });

      // eslint-disable-next-line
      // await api.put('/logout', requestBody);

      // token shows that user is logged in -> removing it shows that he has logged out
      localStorage.removeItem('token');
      localStorage.removeItem("id");

      // Logout successfully worked --> navigate to the route /login
      this.props.history.push(`/login`);
    } catch (error) {
      alert(`Something went wrong during the logout: \n${handleError(error)}`)
    }

  }


  async componentDidMount() {
    // try {
    //   const response = await api.get('/users');
    //   // delays continuous execution of an async operation for 1 second.
    //   // This is just a fake async call, so that the spinner can be displayed
    //   // feel free to remove it :)
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //
    //   // Get the returned users and update the state.
    //   this.setState({ users: response.data });
    //
    //   // This is just some data for you to see what is available.
    //   // Feel free to remove it.
    //   console.log('request to:', response.request.responseURL);
    //   console.log('status code:', response.status);
    //   console.log('status text:', response.statusText);
    //   console.log('requested data:', response.data);
    //
    //   // See here to get more data.
    //   console.log(response);
    // } catch (error) {
    //   alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    // }
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
          {!this.state.games ? (
              <GridContainer>
                <GridItemTitle> A </GridItemTitle>
                <GridItemTitle> B </GridItemTitle>
                <GridItemTitle> C </GridItemTitle>
                <GridItemTitle> D </GridItemTitle>
                <GridItemTitle> E </GridItemTitle>
                <div> There are no games available at the moment! </div>
              </GridContainer>
              ) : (
          <GridContainer>
            <GridItemTitle> Game </GridItemTitle>
            <GridItemTitle> Private/ Public </GridItemTitle>
            <GridItemTitle> Players </GridItemTitle>
            <GridItemTitle> Bots </GridItemTitle>
            <GridItemTitle> Choose Game </GridItemTitle>
               {this.state.games.map(game => {
                 return (
                     // using "Fragment" allows use to render multiple components in this function
                     <Fragment>
                       <GridNormalItem> 1 </GridNormalItem>
                       <GridNormalItem> 2 </GridNormalItem>
                       <GridNormalItem> 3 </GridNormalItem>
                       <BotContainer>
                         <BotCell> Angels: </BotCell>
                         <BotCell> Devils: </BotCell>
                       </BotContainer>
                       <ChooseGameContainer>
                         <input type="radio" id="game" name="name" value={this.state.games.indexOf(game)}/>
                       </ChooseGameContainer>
                     </Fragment>
                 )})}
          </GridContainer>
              )}

          <ButtonGroup>
            <ButtonContainer>
              <Button
                  width="50%"
                  disabled={!this.state.game}
                  // gameLobby is a temporary name
                  onClick={() => {
                    this.props.history.push('/gameLobby');
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

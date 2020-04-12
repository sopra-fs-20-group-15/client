import React, {Component} from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Header from "../../views/Header";
import JustOneLogo from "../../views/JustOneLogo.png";
import TriangleBackground from '../../views/TriangleBackground.png'


const GridItemTitle = styled.div`
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;
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
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;

`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  grid-gap: 3px 3px;
  background-color: #000000;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  
  left: 316px;
  right: 316px;
  top: 260px;
  bottom: 200px;
  overflow-y: scroll;
  
  
  border: 1px solid #FFFFFF;
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Games = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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


class LobbyOverview extends Component {
  constructor() {
    super();
    this.state = {
      games: [1, 2]
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
      const response = await api.put('/logout', requestBody);

      // Logout successfully worked --> navigate to the route /login
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      this.props.history.push(`/login`);
    } catch (error) {
      alert(`Something went wrong during the logout: \n${handleError(error)}`)
      this.props.history.push('/login');
      localStorage.removeItem('token');
      localStorage.removeItem('id');
    }

  }


  async componentDidMount() {
    try {
      const response = await api.get('/users');
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      this.setState({ users: response.data });

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  render() {
    return (
        <BaseContainer style={background}>
          <img className={"center"} src={JustOneLogo} alt={"JustOneLogo"}/>
          {!this.state.games ? (
              <div> There are no games available at the moment! </div>
              ) : (
          <GridContainer>
            <GridItemTitle> A </GridItemTitle>
            <GridItemTitle> B </GridItemTitle>
            <GridItemTitle> C </GridItemTitle>
            <GridItemTitle> D </GridItemTitle>
            <GridItemTitle> E </GridItemTitle>
            {this.state.games.map(game =>{
              return (
                  <div>
                    <div>
                      <GridNormalItem> 1 </GridNormalItem>
                    </div>
                    <div>
                      <GridNormalItem> 2 </GridNormalItem>
                    </div>
                    <div>
                      <GridNormalItem> 3 </GridNormalItem>
                    </div>
                    <div>
                      <GridNormalItem> 4 </GridNormalItem>
                    </div>
                    <div>
                      <GridNormalItem> 5 </GridNormalItem>
                    </div>
                  </div>
              )
            })}
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

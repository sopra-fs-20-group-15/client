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
  bottom: 312px;
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



class LobbyOverview extends Component {
  constructor() {
    super();
    this.state = {
      users: null,
      userForProfile: null
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
          <GridContainer>
            <GridItemTitle> Game Name </GridItemTitle>
            <GridItemInput>
              <InputField
                  placeholder="Enter here.."
                  onChange={e => {this.handleInputChange('gameName', e.target.value)}}
              />
            </GridItemInput>

            <GridItemTitle> Private/Public </GridItemTitle>
            <GridItemInput>
              <select value={this.state.maxNumberOfPlayers} onChange={e => {this.handleMaxNrOfPlayersInput('maxNumberOfPlayers', parseInt(e.target.value))}}>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </GridItemInput>

            <GridItemTitle> Players </GridItemTitle>
            <GridItemInput>
              <Minus onClick={this.handleDecreaseAngels.bind(this)}> - </Minus>
              <Number> {this.state.numberOfAngels} </Number>
              <Plus onClick={this.handleIncreaseAngels.bind(this)}> + </Plus>
            </GridItemInput>

            <GridItemTitle> Bots </GridItemTitle>
            <GridItemInput>
              <Minus onClick={this.handleDecreaseDevils.bind(this)}> - </Minus>
              <Number> {this.state.numberOfDevils} </Number>
              <Plus onClick={this.handleIncreaseDevils.bind(this)}> + </Plus>
            </GridItemInput>

            <GridItemTitle> Choose Game </GridItemTitle>
            <GridItemInput>
              <InputField
                  placeholder="Enter here.."
                  onChange={e => {this.handleInputChange('password', e.target.value)}}
              />
            </GridItemInput>
          </GridContainer>

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

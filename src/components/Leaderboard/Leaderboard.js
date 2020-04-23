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
  grid-template-columns: 90px 210px 210px auto;
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


class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: null
        };

        this.interval = setInterval(this.getPlayers, 5000);
        this.getPlayers = this.getPlayers.bind(this);
    }


    async logout() {
        try {

            const requestBody = JSON.stringify({
                token: localStorage.getItem('token'),
                id: localStorage.getItem('id'),
            });

            await api.put('/logout', requestBody);
            // token shows that user is logged in -> removing it shows that he has logged out
            localStorage.removeItem('token');


            // Logout successfully worked --> navigate to the route /login
            this.props.history.push(`/login`);
        } catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`)
        }

    }


    getPlayers = async () => {
        const response = await api.get('/leaderBoards');
        if (response.status === 200) {
            this.setState({
                players: response.data
            })
        }
    };

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        // making sure that the new number of players does not violate the constraints imposed by the game rules
        this.setState({[key]: value});
    }

    async componentDidMount() {
        try {
            this.getPlayers();
        } catch (error) {
            alert(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);
            this.props.history.push("/leaderboard")
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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
                {/** The first condition is needed if no game has been created yet. Before the GET request for the available
                 lobbies has been processed (takes a few milliseconds), this.state.lobbies equals null. After the request
                 has finished processing, this.state.lobbies now equals an empty array. Without the first condition an error
                 would occur, since the render() method would try to get the length of a null value (first phase, before
                 GET request has been processed).*/}
                {!this.state.players || !(this.state.players.length > 0) ? (
                    <GridContainer>
                        <GridItemTitle> Rank</GridItemTitle>
                        <GridItemTitle> PlayerName </GridItemTitle>
                        <GridItemTitle> GamesPlayed</GridItemTitle>
                        <GridItemTitle> Score</GridItemTitle>
                        <ErrorMessage>
                            There are no Players!
                        </ErrorMessage>
                    </GridContainer>
                ) : (
                    <GridContainer>
                        <GridItemTitle> Rank</GridItemTitle>
                        <GridItemTitle> PlayerName </GridItemTitle>
                        <GridItemTitle> GamesPlayed</GridItemTitle>
                        <GridItemTitle> Score</GridItemTitle>
                        {this.state.players.map(player => {
                            return (
                                // using "Fragment" allows use to render multiple components in this function
                                <Fragment>
                                    <GridNormalItem> {player.rank} </GridNormalItem>
                                    <GridNormalItem> {player.playerName} </GridNormalItem>
                                    <GridNormalItem> {player.gamesPlayed} </GridNormalItem>
                                    <GridNormalItem> {player.score} </GridNormalItem>

                                </Fragment>
                            )
                        })}
                    </GridContainer>
                )}

                <ButtonGroup>
                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {
                                this.props.history.push('/lobbyOverview');
                            }}
                        >
                            Back To Lobby Overview
                        </Button>
                    </ButtonContainer>
                </ButtonGroup>
            </BaseContainer>
        );
    }
}

export default withRouter(Leaderboard);
import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {Button} from '../../views/design/Button';
import {withRouter} from 'react-router-dom';
import TriangleBackground from '../../views/pictures/TriangleBackground.png';
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
  display: flex;
  font-family: Happy Monkey;
  font-size: 20px;
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
  grid-auto-rows: 30px;
  
  left: 316px;
  right: 316px;
  top: 260px;
  bottom: 145px;
  overflow-y: auto;
  
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
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


class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: null
        };

        this.interval = setInterval(this.getPlayers, 5000);
        this.getPlayers = this.getPlayers.bind(this);
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
                <PregameHeaderComponent from={"leaderboard"} history={this.props.history} loggedIn={true}/>
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
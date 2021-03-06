import React, {Component} from 'react';
import styled from 'styled-components';
import TriangleBackground from '../../views/pictures/TriangleBackground.png'
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import {Button} from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import PregameHeaderComponent from "../../views/PregameHeaderComponent";


/** "text-decoration-skip-ink: none" is used to make sure that the brackets are underlined too */
/** needs "text-align: center" additionally because some titles span over two lines */
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

// we need overflow-y: scroll so the border of the corner cells does not overlap the grid container
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
  grid-gap: 3px 3px;
  background-color: #000000;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  height: 350px
  left: 27.71%;
  right: 27.71%;
  top: 34%;
  overflow-y: hidden;
`;

const GridItemInput = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const PlusMinus = styled.div`
    position: absolute;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: rgba(203, 189, 140, 0.54);
    right: ${props => (props.plus ? "30px" : "default")};
    left: ${props => (props.plus ? "default" : "330px")};
    font-size: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    &:hover {
    transform: translateY(-2px);
    }
    border: none;
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    opacity: ${props => (props.disabled ? 0.4 : 1)};
    transition: all 0.3s ease;
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
  width: 45%;
  height: 40px;
  background: rgba(203, 189, 140, 0.54);
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  border-color: rgba(203, 189, 140, 0.54);
  font-family: Happy Monkey;
`;

const Number = styled.div`
  font-family: Happy Monkey;
  font-size: 40px;
  justify-content: center;
  text-align: center;
`;

const ButtonGroup = styled.div`
  position: absolute;
  bottom: 5%;
  left: 30%;
  right: 30%;
`;

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};


class CreateGame extends Component{
    constructor(props) {
        super(props);
        this.state = {
            gameName: null,
            maxNumberOfPlayers: 3,
            numberOfAngels: 0,
            numberOfDevils: 0,
            password: null
        };

        this.handleDecreaseAngels = this.handleDecreaseAngels.bind(this);
        this.handleIncreaseAngels = this.handleIncreaseAngels.bind(this);
        this.handleDecreaseDevils = this.handleDecreaseDevils.bind(this);
        this.handleIncreaseDevils = this.handleIncreaseDevils.bind(this);

    }

    /** Creates a game */
    async createGame() {
        try {
            const requestBody = JSON.stringify({
                gameName: this.state.gameName,
                numberOfPlayers: this.state.maxNumberOfPlayers,
                numberOfAngles: this.state.numberOfAngels,
                numberOfDevils: this.state.numberOfDevils,
                gameType: (this.state.password === null ? "PUBLIC" : "PRIVATE"),
                password: this.state.password,
                playerToken: localStorage.getItem('token')
            });

            const response = await api.post('/games', requestBody);

            localStorage.setItem('gameId', response.data.gameId);
            localStorage.setItem('LobbyGuard',response.data.gameId);

            this.props.history.push(`/lobby/${response.data.gameId}`);
        } catch (error) {
            console.log('Error in createGame()', handleError(error));
            this.props.history.push('/lobbyOverview');
        }
    }

    /** Lets a player go back to the lobby overview */
    async cancel() {
        try {
            this.props.history.push('/lobbyOverview')
        } catch (error) {
            console.log('Error in cancel()', handleError(error))
        }
    }

    /** Handle input that is being typed in an input field
     * @param: string key
     * @param: string value */
    handleInputChange(key, value) {
        this.setState({[key]: value});
    }

    /** Lets a player set the maximum number of players
     * @param: string key
     * @param: int value */
    handleMaxNrOfPlayersInput(key, value) {
        if (this.state.numberOfDevils + this.state.numberOfAngels < value) {
            this.setState({[key]: value})
        } else if (this.state.numberOfDevils + this.state.numberOfAngels === value) {
            alert("You have to leave room for yourself!")
        } else {
            alert("The maximum number of players is lower than the number of bots you want to play with!")
        }
    }

    /** Lets a player decrease the number of angels */
    handleDecreaseAngels = () => {
        if (this.state.numberOfAngels !== 0) {
            this.setState({numberOfAngels: this.state.numberOfAngels - 1})
        } else {
            alert("The number of bots cannot be negative!")
        }
    };

    /** Lets a player increase the number of angels */
    handleIncreaseAngels = () => {
        if (this.state.numberOfDevils + this.state.numberOfAngels < this.state.maxNumberOfPlayers - 1 && this.state.numberOfAngels + 1 <= 5) {
            this.setState({numberOfAngels: this.state.numberOfAngels + 1})
        } else {
            if (this.state.numberOfAngels + 1 > 5) {
                alert("No more than five angels can be added!")
            } else {
                alert("No more bots can be added!")
            }
        }
    };

    /** Lets a player decrease the number of devils */
    handleDecreaseDevils = () => {
        if (this.state.numberOfDevils !== 0) {
            this.setState({numberOfDevils: this.state.numberOfDevils - 1})
        } else {
            alert("The number of bots cannot be negative!")
        }
    };

    /** Lets a player increase the number of devils */
    handleIncreaseDevils = () => {
        if (this.state.numberOfDevils + this.state.numberOfAngels < this.state.maxNumberOfPlayers - 1 && this.state.numberOfDevils + 1 <= 5) {
            this.setState({numberOfDevils: this.state.numberOfDevils + 1})
        } else {
            if (this.state.numberOfAngels + 1 > 5) {
                alert("No more than five devils can be added!")
            } else {
                alert("No more bots can be added!")
            }
        }
    };

    render() {
        return (
            <BaseContainer style={background}>
                <PregameHeaderComponent from={"createGame"} history={this.props.history} loggedIn={true}/>
                <GridContainer>
                    <GridItemTitle> Game Name </GridItemTitle>
                    <GridItemInput>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {this.handleInputChange('gameName', e.target.value)}}
                        />
                    </GridItemInput>
                    <GridItemTitle> Max. Number of Players </GridItemTitle>
                    <GridItemInput>
                        <select value={this.state.maxNumberOfPlayers} onChange={e => {this.handleMaxNrOfPlayersInput('maxNumberOfPlayers', parseInt(e.target.value))}}>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </select>
                    </GridItemInput>
                    <GridItemTitle> Add Angels </GridItemTitle>
                    <GridItemInput>
                        <PlusMinus onClick={this.handleDecreaseAngels.bind(this)} plus={false}> - </PlusMinus>
                        <Number> {this.state.numberOfAngels} </Number>
                        <PlusMinus onClick={this.handleIncreaseAngels.bind(this)} plus={true}> + </PlusMinus>
                    </GridItemInput>
                    <GridItemTitle> Add Devils </GridItemTitle>
                    <GridItemInput>
                        <PlusMinus onClick={this.handleDecreaseDevils.bind(this)} plus={false}> - </PlusMinus>
                        <Number> {this.state.numberOfDevils} </Number>
                        <PlusMinus onClick={this.handleIncreaseDevils.bind(this)} plus={true}> + </PlusMinus>
                    </GridItemInput>
                    <GridItemTitle> Password (Optional) </GridItemTitle>
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
                            // The trim() method lets us check for empty strings that
                            disabled={!this.state.gameName || this.state.gameName.trim() === "" || (this.state.password && this.state.password.trim() === "")}
                            onClick={() => {
                                this.createGame();
                            }}
                        >
                            Create Game
                        </Button>
                    </ButtonContainer>

                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {
                                this.cancel();
                            }}
                        >
                            Cancel
                        </Button>
                    </ButtonContainer>
                </ButtonGroup>
            </BaseContainer>
        );
    }
}

export default withRouter(CreateGame);

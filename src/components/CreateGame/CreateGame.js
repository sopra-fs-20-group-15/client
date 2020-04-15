import React, {Component} from 'react';
import styled from 'styled-components';
import TriangleBackground from '../../views/TriangleBackground.png'
import JustOneLogo from '../../views/JustOneLogo.png'
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import {Button, LogoutButton} from '../../views/design/Button';
import { withRouter } from 'react-router-dom';


// "text-decoration-skip-ink: none" is used to make sure that the brackets are underlined too
// needs "text-align: center" because some titles span over two lines
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
  top: 35%;
  overflow-y: scroll;
`;

const GridItemInput = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const Minus = styled.div`
    position: absolute;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: rgba(203, 189, 140, 0.54);
    left: 330px;
    font-size: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    &:hover {
    transform: translateY(-2px);
    }
    width: ${props => props.width || null};
    border: none;
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    opacity: ${props => (props.disabled ? 0.4 : 1)};
    transition: all 0.3s ease;
`;

const Plus = styled.div`
    position: absolute;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: rgba(203, 189, 140, 0.54);
    right: 30px;
    font-size: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    &:hover {
    transform: translateY(-2px);
    }
    width: ${props => props.width || null};
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

const LogoutButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 15px;
  justify-content: center;
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

        // any way to refactor this into one (or two) methods?
        /* The bind() method creates a new function that, when called, has its this keyword
        set to the provided value, with a given sequence of arguments preceding any provided when
        the new function is called. */
        this.handleDecreaseAngels = this.handleDecreaseAngels.bind(this);
        this.handleIncreaseAngels = this.handleIncreaseAngels.bind(this);
        this.handleDecreaseDevils = this.handleDecreaseDevils.bind(this);
        this.handleIncreaseDevils = this.handleIncreaseDevils.bind(this);

    }

    async createGame() {
        try {
            // requestBody should be in accordance with REST specification for GamePostDTO
            const requestBody = JSON.stringify({
                gameName: this.state.gameName,
                numberOfPlayers: this.state.maxNumberOfPlayers,
                numberOfAngles: this.state.numberOfAngels,
                numberOfDevils: this.state.numberOfDevils,
                // is this variable necessary? -> possible for backend to decide base on whether password is null?
                gameType: (this.state.password === null ? "PUBLIC" : "PRIVATE"),
                password: this.state.password,
                playerToken: localStorage.getItem('token')
            });

            const response = await api.post('/games', requestBody);

            // player creates a game -> gameId is saved in his local storage
            // response.data gives us a dictionary with the different return values documented in our REST specifications
            localStorage.setItem('gameId', response.data.gameId);

            // registration successfully worked --> navigate to the route /login
            this.props.history.push(`/lobby/${response.data.gameId}`);
        } catch (error) {
            alert(`Something went wrong during the creation of the game: \n${handleError(error)}`)
            // this.props.history.push('/lobbyOverview');
        }
    }

    async cancel() {
        try {
            this.props.history.push('/lobbyOverview')
        } catch (error) {
            alert(`Something went wrong during the cancellation of the game: \n${handleError(error)}`)
        }
    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        // making sure that the new number of players does not violate the constraints imposed by the game rules
        this.setState({[key]: value});
    }

    handleMaxNrOfPlayersInput(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        // making sure that the new number of players does not violate the constraints imposed by the game rules
        if (this.state.numberOfDevils + this.state.numberOfAngels + value <= 7) {
            this.setState({[key]: value});
        } else {
            alert("You have already reached the maximum! The number of bots plus the players allowed to join your game would exceed seven!")
        }
    }

    /* state: the data is updated
    *  callback:  updated value is displayed to the user by calling console.log on the value*/
    handleDecreaseAngels = () => {
        // making sure the number of bots can't be below zero (because that would make no fucking sense...)
        if (this.state.numberOfAngels !== 0) {
            this.setState({numberOfAngels: this.state.numberOfAngels - 1}, () => {
                console.log(this.state.numberOfAngels)
            });
        } else {
            alert("The number of bots cannot be negative!")
        }
    };

    handleIncreaseAngels = () => {
        /* making sure that the total number of participants in the game (including bots) does not exceed seven
           (only necessary to check when incrementing, obviously)
           (can this condition be refactored, so it only has to be stated once?) */
        if (this.state.maxNumberOfPlayers + this.state.numberOfDevils + this.state.numberOfAngels < 7) {
            this.setState({numberOfAngels: this.state.numberOfAngels + 1}, () => {
                console.log(this.state.numberOfAngels)
            });
        } else {
            alert("No more bots can be added!")
        }
    };

    handleDecreaseDevils = () => {
        if (this.state.numberOfDevils !== 0) {
            this.setState({numberOfDevils: this.state.numberOfDevils - 1}, () => {
                console.log(this.state.numberOfDevils)
            });
        } else {
            alert("The number of bots cannot be negative!")
        }
    };

    handleIncreaseDevils = () => {
        if (this.state.maxNumberOfPlayers + this.state.numberOfDevils + this.state.numberOfAngels < 7) {
            this.setState({numberOfDevils: this.state.numberOfDevils + 1}, () => {
                console.log(this.state.numberOfDevils)
            });
        } else {
            alert("No more bots can be added!")
        }
    };

    render() {
        return (
            <BaseContainer style={background}>
                <img className={"center"} src={JustOneLogo} alt={"JustOneLogo"}/>
                <LogoutButtonContainer>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.props.history.push('/login');
                        }}
                    >
                        Logout
                    </LogoutButton>
                </LogoutButtonContainer>
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
                        <Minus onClick={this.handleDecreaseAngels.bind(this)}> - </Minus>
                        <Number> {this.state.numberOfAngels} </Number>
                        <Plus onClick={this.handleIncreaseAngels.bind(this)}> + </Plus>
                    </GridItemInput>

                    <GridItemTitle> Add Devils </GridItemTitle>
                    <GridItemInput>
                        <Minus onClick={this.handleDecreaseDevils.bind(this)}> - </Minus>
                        <Number> {this.state.numberOfDevils} </Number>
                        <Plus onClick={this.handleIncreaseDevils.bind(this)}> + </Plus>
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

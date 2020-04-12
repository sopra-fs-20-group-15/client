import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button, LogoutButton } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import JustOneLogo from "../../views/JustOneLogo.png";
import TriangleBackground from '../../views/TriangleBackground.png'
import Header from "../../views/Header";


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
  border: 1.5px solid;
`;

const GridNormalItem = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  font-family: Happy Monkey;
  font-size: 24px;
  border: 1.20px solid;
`;

const UIContainer = styled.div`
  display: grid;
  grid-template-columns: 300px;
  background-color: #ECDD8F;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  
  left: 25%;
  top: 33%;
  bottom: 20%;
  overflow-y: scroll;
  
  border: 3px solid;
  // box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 300px;
  background-color: #ECDD8F;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  
  left: 25%;
  top: 33%;
  bottom: 20%;
  overflow-y: scroll;
  
  border: 3px solid;
  // box-sizing: border-box;
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

const ChooseGameContainer = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

class Lobby extends React.Component {
    constructor() {
        super();
        this.state = {
            players: ["Enura","SlyLutheraner","xX_YasuoOnly_Xx","JamiesRightHand69","SuperCamper1337"]
        };
    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    componentDidMount() {}

    render() {
        return (
            <BaseContainer style={background}>
                <img className={"center"} src={JustOneLogo} alt={"JustOneLogo"}/>

                    <GridContainer>
                        <GridItemTitle> Players </GridItemTitle>
                        {this.state.players.map(user => {
                            return (
                                <Fragment>
                                    <GridNormalItem> {user} </GridNormalItem>
                                </Fragment>
                            )})}
                    </GridContainer>

                <ButtonGroup>
                    <ButtonContainer>
                    {/*    <Button*/}
                    {/*        width="50%"*/}
                    {/*        disabled={!this.state.game}*/}
                    {/*        // gameLobby is a temporary name*/}
                    {/*        onClick={() => {*/}
                    {/*            this.props.history.push('/gameLobby');*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        Join Lobby*/}
                    {/*    </Button>*/}
                    {/*</ButtonContainer>*/}
                    {/*<ButtonContainer>*/}
                    {/*    <Button*/}
                    {/*        width="50%"*/}
                    {/*        onClick={() => {*/}
                    {/*            this.props.history.push('/createGame');*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        Create Lobby*/}
                    {/*    </Button>*/}
                    {/*</ButtonContainer>*/}
                    {/*<ButtonContainer>*/}
                    {/*    <Button*/}
                    {/*        width="50%"*/}
                    {/*        onClick={() => {*/}
                    {/*            this.props.history.push('/leaderboard');*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        See Leaderboard*/}
                    {/*    </Button>*/}
                    </ButtonContainer>
                </ButtonGroup>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Lobby);
import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {LogoutButton} from '../../views/design/Button';
import {withRouter} from 'react-router-dom';
import TriangleBackground from '../../views/pictures/TriangleBackground.png';
import {Form,InstructionText} from "../../views/design/RulesAndTutorial/RulesAndTutorialUI";

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

const TopButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  justify-content: center;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Rules extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {}

    render() {
        return (
            <BaseContainer  style={background}>
                <TopButtonContainer style={{left:"12px"}}>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.props.history.push("/"+localStorage.getItem('QA'));
                        }}
                    >
                        Go Back
                    </LogoutButton>
                </TopButtonContainer>
                <TopButtonContainer style={{right:"12px"}}>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.props.history.push("/tutorial");
                        }}
                    >
                        Tutorial
                    </LogoutButton>
                </TopButtonContainer>
                <Form style={{top:"90px", height:"625px", paddingTop:"1%", paddingLeft:"1%", paddingRight:"1%", right:"0.4%", wordBreak:"normal"}}>
                    <InstructionText style={{fontWeight:"bold"}}>OBJECT OF THE GAME</InstructionText>
                    <InstructionText>Just One is a cooperative game. You all play together to get the best Score!</InstructionText>
                    <InstructionText style={{marginTop:"8px"}}>As a team, the passive players choose their
                        clues without coordination with each other. Be creative in order to not write the same clue as other players, as all indentical clues will
                        be canceled before the active player gets to see them. Your scores are based on the number of mystery words found. The game ends when the
                        deck is empty.</InstructionText>
                    <InstructionText style={{marginTop:"55px"}}>To get a better understanding of the game, try to play the tutorial!</InstructionText>
                    <InstructionText style={{fontWeight:"bold", marginTop:"8px"}}>GIVING CLUES</InstructionText>
                    <InstructionText style={{marginTop:"8px"}}></InstructionText>

                </Form>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Rules);
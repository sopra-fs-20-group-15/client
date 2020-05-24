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
                        clues without coordination with each other. Be creative in order to not write the same clue as other players, as all identical clues will
                        be canceled before the active player gets to see them. Your scores are based on the number of mystery words found. The game ends when the
                        deck is empty.</InstructionText>
                    <InstructionText style={{marginTop:"55px"}}>To get a better understanding of the game, try to play the tutorial!</InstructionText>

                    <InstructionText style={{fontWeight:"bold", marginTop:"8px"}}>GIVING CLUES</InstructionText>
                    <InstructionText style={{marginTop:"8px"}}>In the physical version of the game, the passive players have to decide, whether their clues are valid
                    or not. In this implementation of Just One however, the game decides it for the players. Numbers, acronym, onomatopoeia or special characters are
                    considered as valid clues. Invalid clues are:</InstructionText>
                    <InstructionText style={{marginTop:"55px"}}>- The mystery word but written differently (Shurt is not allowed for Shirt)</InstructionText>
                    <InstructionText>- A word of the same family as the mystery word (Prince is not allowed for Princess)</InstructionText>
                    <InstructionText style={{marginTop:"8px"}}>Identical clues are:</InstructionText>
                    <InstructionText style={{marginTop:"8px"}}>- Two identical words (Mouse and Mouse are identical)</InstructionText>
                    <InstructionText>- Variants from the same word family (Prince and Princess are considered identical)</InstructionText>

                    <InstructionText style={{fontWeight:"bold", marginTop:"10px"}}>GIVING GUESS</InstructionText>
                    <InstructionText style={{marginTop:"8px"}}>Different from the physical game, there is no way to skip a guess and you have to guess the word, even
                    if no valid clues are given. This decision was made in order to increase the difficulty of the game and to encourage more creative clues. If the guess
                    has the same pronunciation as the mystery word, the guess is considered to be valid automatically.</InstructionText>
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
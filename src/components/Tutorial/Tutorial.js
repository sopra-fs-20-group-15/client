import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {Button, LogoutButton} from '../../views/design/Button';
import {GuessedCards,Deck,ActiveCard,Number,Word} from "../../views/design/InGame/CardsUI";
import {Phase,PhaseCircle,PhaseMessage} from "../../views/design/InGame/PhaseUI";
import {Player,PlayerContainer,ReadyField,Input,InputField,Output,NameField,NameFieldActivePlayer,GuessedCardsField,ScoreField} from "../../views/design/InGame/PlayerUI";
import {withRouter} from 'react-router-dom';
import TriangleBackground from "../../views/pictures/TriangleBackground.png";
import {HUDContainer} from "../../views/design/InGame/InGameUI";

const Form = styled.div`
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  
  position: absolute;
  
  right: -3%;
  height: 650px;
  width: 1350px;
  top: 70px;
  bottom: 200px;
  
  padding-top: 5%;
  padding-left: 10%;
  padding-right: 10%;
  
  border: 2px solid rgba(0, 0, 0, 1);
  box-sizing: border-box;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  
  font-family: Happy Monkey;
  font-size: 20px;
  font-weight: 500;
  
  border-radius: 20px;
  background: #E4DAA5;
`;

const CommentField = styled.div`
  justify-content: center;
  position: absolute;
  
  height: 60px;
  width: 500px;
  bottom: 5%;
  left: 33%
  
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 15px;
  
  border: 2px solid rgba(0, 0, 0, 1);
  box-sizing: border-box;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  
  font-family: Happy Monkey;
  font-size: 25px;
  font-weight: 500;
  
  border-radius: 20px;
  background: #CBBD8C;
`;

const InstructionText = styled.div`
  
  height: 25px;
  width: 100%;
  
  // border: 1px solid rgba(0, 0, 0, 1);
  // box-sizing: border-box;
  
  font-family: Happy Monkey;
  font-size: 20px;
  font-weight: 500;
`;

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

const TopButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  // right: 15px;
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
class Tutorial extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            phaseNumber: 1,
            phases: ["1. Choose Number", "2. Write Clues", "3. Guess Word", "4. Word Reveal"],
            mysteryWordId: null,
            mysteryWords: ["Apple","Netflix","Chill","Naruto","Ghibli"],
            aliceInput: null,
            bobInput: null,
            comment: null,
            aliceNumber: 0,
        };
    }

    updatePhaseHUD(id) {
        for (let i=1 ; i<=4 ; i++) {
            if (i === id) {
                if (id === 1 || id === 3) {
                    let greenPhase = document.getElementById("phase" + i);
                    greenPhase.style.backgroundColor = "#FF0000";
                } else if (id === 2) {
                    let greenPhase = document.getElementById("phase" + i);
                    greenPhase.style.backgroundColor = "#FCC812";
                } else if (id === 4) {
                    let greenPhase = document.getElementById("phase" + i);
                    greenPhase.style.backgroundColor = "#05FF00";
                }
            } else {
                let greyPhase = document.getElementById("phase"+i);
                greyPhase.style.backgroundColor = "#817857";
            }
        }
    }

    updateMysteryWord(input) {
        for (let i = 0; i < 5; i++) {
            if (input - 1 !== i) {
                let lineThroughWord = document.getElementById("word" + (i + 1));
                lineThroughWord.style.textDecoration = "line-through";
            }
        }
    }

    updateRightGuess() {
        let field = document.getElementById("alice");
        field.style.backgroundColor = "#0900ff";
    }

    updateWrongGuess() {
        let field = document.getElementById("alice");
        field.style.backgroundColor = "#ED0101";
    }

    handleInputAlice() {
        //actions of active player
        if (this.state.phaseNumber === 1) {
            //determine mystery Word
            if(1<= this.state.aliceInput && this.state.aliceInput <=5){
                this.updatePhaseHUD(2);
                this.setState({
                    phaseNumber:2,
                    comment:"Well Done!",
                    mysteryWordId: this.state.aliceInput
                });
                this.updateMysteryWord(this.state.aliceInput);
            } else {
                this.setState({comment:"Number is not between 1 and 5!"});
            }
        }
        else if (this.state.phaseNumber === 3) {
            //guess mystery word
            if (this.state.aliceInput === this.state.mysteryWords[(this.state.mysteryWordId-1)]){
                this.updatePhaseHUD(4);
                this.setState({phaseNumber:4, comment:"You got it now!", aliceNumber: 1});
                this.updateRightGuess();
            } else {
                this.updatePhaseHUD(4);
                this.setState({phaseNumber:4, comment:"Wrong Guess but still very noice!"});
                this.updateWrongGuess();
            }
        }
        else if (this.state.phaseNumber === 4) {
            this.setState({comment:"The Tutorial is already over!"});
        }
        else {
            this.setState({comment:"It's not Alice's Turn!"});
        }
    }

    handleInputBob() {
        //actions of passive players
        if (this.state.phaseNumber === 2) {
            //gives clue
            if (this.state.bobInput !== this.state.mysteryWords[(this.state.mysteryWordId-1)]){
                this.updatePhaseHUD(3);
                this.setState({phaseNumber:3, comment:"Very Nice!"});
            } else {
                this.setState({comment:"Try to give an valid Clue please!"});
            }
        }
        else if (this.state.phaseNumber === 4) {
            this.setState({comment:"The Tutorial is already over!"});
        }
        else {
            this.setState({comment:"It's not Bob's Turn!"});
        }
    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    componentDidMount() {}

    render() {
        return (
            <BaseContainer  style={background}>
                <TopButtonContainer style={{left:"15px"}}>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.props.history.push("/"+localStorage.getItem('QA'));
                        }}
                    >
                        Go Back
                    </LogoutButton>
                </TopButtonContainer>
                <TopButtonContainer style={{right:"15px"}}>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.props.history.push("/rules");
                        }}
                    >
                        Rules
                    </LogoutButton>
                    <Form>
                        <InstructionText>- Each Round has 4 Phases indicated by the Phase HUD (in this Tutorial at the right Side from the Active Card).</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>Depending on the current Phase, Players has different Tasks to do.</InstructionText>
                        <InstructionText>- Phase 1: The Active Player (indicated by the red Name Box) has to choose a Mystery Word and submit a Number between 1 to 5.</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>To do that, write in the Input Box a Number and submit it by pressing the round Button next to it. (Normally, the Active Player</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>can't see the available Mystery Words on the current Card.)</InstructionText>
                        <InstructionText>- Phase 2: The Passive Players (indicated by the yellow Name Box) has to submit a Clue in this Phase. To do that, write in the Input</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>Box a fitting Clue for the Mystery Word and submit it by pressing the round Button next to it. (Normally, you only control one Player
                                                                     (an active or a passive one) and you can only write and submit Inputs in your own Input Box.</InstructionText>
                        <InstructionText/>
                        <InstructionText>- Phase 3: The Active Player has to submit a Guess based on the Clues the Passive Players gave (usually there are more than one</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>Clues available). Try submitting one!</InstructionText>
                        <InstructionText>- Phase 4: The Guess will be checked and the Scores will be distributed. No Players has to do something in this Phase and the next</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>Round will begin automatically.</InstructionText>
                        <PlayerContainer style={{position:"absolute", top:"65%", right:"80%"}}>
                                <Player style={{marginTop:"1%", marginLeft:"38%"}}>
                                    <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                                    <GuessedCardsField style={{top:"5%", left:"12%"}}>{this.state.aliceNumber}</GuessedCardsField>
                                    <ScoreField>100</ScoreField>
                                        <NameFieldActivePlayer>1. Alice</NameFieldActivePlayer>
                                    <InputField>
                                        <Input placeholder="Enter here.." onChange=
                                            {e => {this.handleInputChange('aliceInput', e.target.value);}}/>)
                                    </InputField>
                                    <ReadyField id={"alice"}
                                                onClick={() => {this.handleInputAlice();}}>
                                    </ReadyField>
                                </Player>
                        </PlayerContainer>
                        <PlayerContainer style={{position:"absolute", top:"65%", right:"11%"}}>
                            <Player style={{marginTop:"1%", marginLeft:"38%"}}>
                                <GuessedCardsField style={{top:"10%", left:"8%"}}/>
                                <GuessedCardsField style={{top:"5%", left:"12%"}}>0</GuessedCardsField>
                                <ScoreField>69</ScoreField>
                                <NameField>2. Bob</NameField>
                                <InputField>
                                    <Input placeholder="Enter here.." onChange=
                                        {e => {this.handleInputChange('bobInput', e.target.value);}}/>)
                                </InputField>
                                <ReadyField
                                    onClick={() => {this.handleInputBob();}}>
                                </ReadyField>
                            </Player>
                        </PlayerContainer>
                        <Phase style={{position:"absolute", bottom:"20%", left:"50%"}}>
                            <PhaseCircle id={"phase1"} style={{left:"26px", backgroundColor:"#FF0000"}}/>
                            <PhaseCircle id={"phase2"} style={{left:"82px"}}/>
                            <PhaseCircle id={"phase3"} style={{left:"138px"}}/>
                            <PhaseCircle id={"phase4"} style={{left:"194px"}}/>
                            <PhaseMessage> {this.state.phases[this.state.phaseNumber-1]} </PhaseMessage>
                        </Phase>
                        <ActiveCard id={"activeCard"} style={{position:"absolute", left:"35%", bottom:"15%"}}>
                            <Number style={{color:"#00CDCD", top:"17.5px"}}> 1. </Number>
                            <Word id={"word1"} style={{borderColor:"#00CDCD", top:"17.5px"}}> {this.state.mysteryWords[0]} </Word>
                            <Number style={{color:"#42c202", top:"65px"}}> 2. </Number>
                            <Word id={"word2"} style={{borderColor:"#42c202", top:"35px"}}> {this.state.mysteryWords[1]} </Word>
                            <Number style={{color:"#db3d3d", top:"112.5px"}}> 3. </Number>
                            <Word id={"word3"} style={{borderColor:"#db3d3d", top:"52.5px"}}> {this.state.mysteryWords[2]} </Word>
                            <Number style={{color:"#fc9229", top:"160px"}}> 4. </Number>
                            <Word id={"word4"} style={{borderColor:"#fc9229", top:"70px"}}> {this.state.mysteryWords[3]} </Word>
                            <Number style={{color:"#ffe203", top:"207.5px"}}> 5. </Number>
                            <Word id={"word5"} style={{borderColor:"#ffe203", top:"87.5px"}}> {this.state.mysteryWords[4]} </Word>
                        </ActiveCard>
                        <CommentField>{this.state.comment}</CommentField>
                    </Form>
                </TopButtonContainer>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Tutorial);
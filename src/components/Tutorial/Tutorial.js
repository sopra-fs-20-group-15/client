import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {LogoutButton} from '../../views/design/Button';
import {ChooseWord,ActiveCardContainer,Number,Word} from "../../views/design/InGame/CardsUI";
import {Phase,PhaseCircle,PhaseMessage} from "../../views/design/InGame/PhaseUI";
import {
    Player,
    PlayerContainer,
    SignalFieldPlayer,
    Input,
    InputField,
    NameField,
    NameFieldActivePlayer,
    GuessedCardsField,
    ScoreField
} from "../../views/design/InGame/PlayerUI";
import {withRouter} from 'react-router-dom';
import TriangleBackground from "../../views/pictures/TriangleBackground.png";
import {Form, InstructionText} from "../../views/design/RulesAndTutorial/RulesAndTutorialUI";

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

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

const TopButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  justify-content: center;
`;

class Tutorial extends React.Component {
    constructor() {
        super();
        this.state = {
            phaseNumber: 1,
            phases: ["1. Choose Number", "2. Write Clues", "3. Guess Word", "4. Word Reveal"],
            mysteryWordId: null,
            mysteryWords: ["Apple","Netflix","Chill","Naruto","Ghibli"],
            aliceInput: null,
            bobInput: null,
            comment: "Click on a Word!",
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

    setMysteryWord(number) {
        this.updatePhaseHUD(2);
        this.setState({
            phaseNumber:2,
            comment:"Well Done!",
            mysteryWordId: number
        });
        this.updateMysteryWord(number);
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
        if (this.state.phaseNumber === 1) {
            this.setState({comment:"Click on a Word!"});
        }
        else if (this.state.phaseNumber === 3) {
            //guess mystery word
            if (this.state.aliceInput.toLowerCase() === this.state.mysteryWords[(this.state.mysteryWordId-1)].toLowerCase()){
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
        if (this.state.phaseNumber === 1) {
            this.setState({comment:"Click on a Word!"});
        }
        //actions of passive players
        else if (this.state.phaseNumber === 2) {
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
                            this.props.history.push("/rules");
                        }}
                    >
                        Rules
                    </LogoutButton>
                    <Form>
                        <InstructionText>- Each Round has 4 Phases indicated by the Phase HUD (in this Tutorial at the right Side from the Active Card). Depending on the</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>current Phase, Players have different Tasks to do.</InstructionText>
                        <InstructionText>- Phase 1: The Active Player (indicated by the red Name Box) has to choose a Mystery Word by clicking on it. (Normally, the Active</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>Player can't see the available Mystery Words on the current Card.)</InstructionText>
                        <InstructionText>- Phase 2: The Passive Players (indicated by the yellow Name Box) has to submit a Clue on this Phase. To do that, write in the</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>Input Box a fitting Clue for the Mystery Word and submit it by pressing the round Button right to the Input Box. (Normally, you only control one Player
                                                                     (an active or a passive one) and you can only write and submit Inputs in your own Input Box.</InstructionText>
                        <InstructionText/>
                        <InstructionText>- Phase 3: The Active Player has to submit a Guess based on the Clues the Passive Players have given (usually, there are more</InstructionText>
                        <InstructionText style={{marginLeft:"14px"}}>than one Clue available). Try submitting one!</InstructionText>
                        <InstructionText>- Phase 4: The Guess will be checked and the Scores will be distributed. No Player has to do something in this Phase and the next</InstructionText>
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
                                    <SignalFieldPlayer id={"alice"}
                                                onClick={() => {this.handleInputAlice();}}>
                                    </SignalFieldPlayer>
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
                                <SignalFieldPlayer
                                    onClick={() => {this.handleInputBob();}}>
                                </SignalFieldPlayer>
                            </Player>
                        </PlayerContainer>
                        <Phase style={{position:"absolute", bottom:"20%", left:"50%"}}>
                            <PhaseCircle id={"phase1"} style={{left:"26px", backgroundColor:"#FF0000"}}/>
                            <PhaseCircle id={"phase2"} style={{left:"82px"}}/>
                            <PhaseCircle id={"phase3"} style={{left:"138px"}}/>
                            <PhaseCircle id={"phase4"} style={{left:"194px"}}/>
                            <PhaseMessage> {this.state.phases[this.state.phaseNumber-1]} </PhaseMessage>
                        </Phase>
                        <ActiveCardContainer id={"activeCard"} style={{position:"absolute", left:"35%", bottom:"15%"}} pulsate={this.state.phaseNumber===1}>
                            <Number style={{color:"#00CDCD", top:"17.5px"}}> 1. </Number>
                            <ChooseWord id={"word1"} style={{borderColor: "#00CDCD", top: "17.5px"}}
                                        disabled={this.state.phaseNumber !== 1}
                                        onClick={() => {this.setMysteryWord(1)}}> {this.state.mysteryWords[0]} </ChooseWord>
                            <Number style={{color:"#42c202", top:"65px"}}> 2. </Number>
                            <ChooseWord id={"word2"} style={{borderColor: "#42c202", top: "35px"}}
                                        disabled={this.state.phaseNumber !== 1}
                                        onClick={() => {this.setMysteryWord(2)}}> {this.state.mysteryWords[1]} </ChooseWord>
                            <Number style={{color:"#db3d3d", top:"112.5px"}}> 3. </Number>
                            <ChooseWord id={"word3"} style={{borderColor: "#db3d3d", top: "52.5px"}}
                                        disabled={this.state.phaseNumber !== 1}
                                        onClick={() => {this.setMysteryWord(3)}}> {this.state.mysteryWords[2]} </ChooseWord>
                            <Number style={{color:"#fc9229", top:"160px"}}> 4. </Number>
                            <ChooseWord id={"word4"} style={{borderColor: "#fc9229", top: "70px"}}
                                        disabled={this.state.phaseNumber !== 1}
                                        onClick={() => {this.setMysteryWord(4)}}> {this.state.mysteryWords[3]} </ChooseWord>
                            <Number style={{color:"#ffe203", top:"207.5px"}}> 5. </Number>
                            <ChooseWord id={"word5"} style={{borderColor: "#ffe203", top: "87.5px"}}
                                        disabled={this.state.phaseNumber !== 1}
                                        onClick={() => {this.setMysteryWord(5)}}> {this.state.mysteryWords[4]} </ChooseWord>
                        </ActiveCardContainer>
                        <CommentField>{this.state.comment}</CommentField>
                    </Form>
                </TopButtonContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Tutorial);
import styled from "styled-components";
import {pulseAnimation} from "./PlayerUI";

/**everything based on Deck and Cards*/

export const GuessedCards = styled.div`
  width: 80px;
  height: 110px;

  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  font-size: 50px;
  text-align: center;
  line-height: 110px;
  color: #52ff02;
  
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
`;

export const Deck = styled.div`
  width: 170px;
  height: 230px;

  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  font-size: 100px;
  text-align: center;
  line-height: 230px;
  
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
`;

export const ActiveCardContainer = styled.div`
  width: 180px;
  height: 255px;
  animation: ${props => (props.pulsate ? pulseAnimation : "default")};
  
  position: absolute;
  bottom: 0%;
  left: 60%;

  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
`;

export const Number = styled.div`
    position: absolute;
    padding: 4px 0;
    height: 30px;
    width: 10%;
    margin-left: 8px;
    margin-right: auto;
    
    font-family: Happy Monkey;
    font-size: 20px;
`;

export const Word = styled.div`
    position: relative;
    &:hover {
    ${props => (props.disabled ? "default" : "transform: scale(1.2)")};
    }
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    padding: 5px 0;
    height: 30px;
    width: 80%;
    margin-left: 30px;
    margin-right: auto;
    
    border-style: solid;
    
    font-family: Happy Monkey;
    font-size: 15px;
    justify-content: center;
    display: flex;
`;
import styled, {css, keyframes} from "styled-components";

/**everything based on Timer Interface*/

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
`;

export const pulseAnimation = css`
    ${pulse} 2s infinite;
`;

export const TimerContainer = styled.div`
  position: relative;
  width: 175px;
  height: 175px;
  display: inline-block;
  border-radius: 50%;
  
  animation: ${props => (props.countdown ? pulseAnimation : "default")}
  
  margin-left: 10px;

  background: #BDAF7E;
  border: 3px solid #000000;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

export const Round = styled.div`
    position: absolute;
    top: 30px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-family: Happy Monkey;
    text-decoration: underline;
    font-size: 28px;
    justify-content: center;
    display: flex;
`;
import styled, {css, keyframes} from "styled-components";

/**everything based on Player Interface*/

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.90);
  }

  100% {
    transform: scale(1);
  }
`;

export const pulseAnimation = css`
    ${pulse} 2s infinite;
`;

export const Player = styled.div`
  width: 350px;
  height: 130px;
  display: inline-block;
  
  position: relative;
`;

export const PlayerContainer = styled.div`
`;

export const SignalField = styled.div`
  height: 70px;
  width: 70px;
  
  position: absolute;
  bottom: 5%;
  right: 5%;
  
  background: #CBBD8C;
  border: 3px solid #000000;
  border-radius: 100px;
  
  text-position: absolute;
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 70px;
  display: flex;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

export const SignalFieldPlayer = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  cursor: ${props => (props.disabled ? "default" : "pointer")};
    
  height: 70px;
  width: 70px;
  
  position: absolute;
  bottom: 5%;
  right: 5%;
  
  background: #CBBD8C;
  border: 3px solid #000000;
  border-radius: 100px;
  
  text-position: absolute;
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 70px;
  display: flex;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

export const InputField = styled.div`
  height: 55px;
  width: 240px;
      
  position: absolute;
  bottom: 0%;
  
  background: #CBBD8C;
  border: 3px solid #000000;
  border-radius: 20px;
  
  padding-top: 3%;
  padding-left: 2%;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

export const InputFieldPlayer = styled.div`
  height: 55px;
  width: 240px;
  
  animation: ${props => (!props.disabled ? pulseAnimation : "default")}
    
  position: absolute;
  bottom: 0%;
  
  background: #CBBD8C;
  border: 3px solid #000000;
  border-radius: 20px;
  
  padding-top: 3%;
  padding-left: 2%;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

export const Input = styled.input`
&::placeholder {
    color: rgba(0, 0, 0, 1);
  }
  height: 55px;
  width: 240px;
  
  padding-bottom: 10%;
  padding-left: 5px;
  
  background: #CBBD8C;
  border:none;
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Output = styled.div`
  height: 55px;
  width: 240px;
  
  padding-bottom: 10%;
  padding-left: 5px;
  
  background: #CBBD8C;
  // border:none;
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NameField = styled.div`
  height: 45px;
  width: 160px;
  
  position: absolute;
  bottom: 34%;
  left: 1%;
  
  background: #FCC812;
  border: 3px solid #000000;
  border-radius: 20px;

  padding-top: 1.25%;
  padding-left: 1.5%;
  white-space: nowrap;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NameFieldActivePlayer = styled.div`
  height: 45px;
  width: 160px;
  
  position: absolute;
  bottom: 34%;
  left: 1%;
  
  background: #FF0000;
  border: 3px solid #000000;
  border-radius: 20px;

  padding-top: 1.25%;
  padding-left: 1.5%;
  white-space: nowrap;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ScoreField = styled.div`
  height: 35px;
  width: 60px;
  
  position: absolute;
  bottom: 36%;
  left: 43%;
  
  text-align: center;
  padding-left: 5%
  padding-right: 3%;
  padding-top: 0.60%;
  
  background: #FFFFFF;
  border: 2px solid #000000;
  box-sizing: border-box;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
`;

export const GuessedCardsField = styled.div`
  height: 50px;
  width: 50px;
  
  position: absolute;
  
  padding-top: 0.5%;
  align-items: center;
  text-align: center;
  
  background: #FFFFFF;
  border: 2px solid #000000;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 23px;
`;
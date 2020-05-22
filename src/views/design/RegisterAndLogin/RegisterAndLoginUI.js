import styled from 'styled-components';

export const FormContainer = styled.div` 
  display: flex;
  flex-direction: column;
  align-items: center;
 
  position: absolute;
  left: 380px;
  right: 380px;
  top: 260px;
  bottom: 200px;
  justify-content: center;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 316px;
  mix-blend-mode: normal;
  border: 1px solid rgba(203, 189, 140, 0.95);
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 20px;
  font-weight: 700;
  padding-left: 125px;
  padding-right: 125px;
  border-radius: 20px;
  background: #E4DAA5;
`;

export const UsernameInputField = styled.input`

  mix-blend-mode: normal;
  border: 1px solid rgba(203, 189, 140, 0.95);
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  &::placeholder {
    font-family: Happy Monkey;
    color: rgba(0, 0, 0, 0.5);
  }
  position: relative;
  left: 0px;
  right: 0px;
  height: 60px;
  padding-left: 45px;
  margin-left: -4px;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(203, 189, 140, 0.95);
  font-family: Happy Monkey;
  top: -2px;
  bottom: 20px; 


`;

export const ButtonGroup = styled.div`
  position: absolute;
  bottom: 10%;
  left: 30%;
  right: 30%;
`;

export const RulesButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 15px;
  justify-content: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 20px;
  margin-top: 20px;
`;

export const PasswordInputField = styled.input`
  mix-blend-mode: normal;
  border: 1px solid rgba(203, 189, 140, 0.95);
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  &::placeholder {
    font-family: Happy Monkey;
    color: rgba(0, 0, 0, 0.5);
  }
  position: relative;
  left: 0px;
  right: 0px;
  height: 60px;
  padding-left: 45px;
  margin-left: -4px;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(203, 189, 140, 0.95);
  
  top: 13px;
  bottom: 20px;
`;
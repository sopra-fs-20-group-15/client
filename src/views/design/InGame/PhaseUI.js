import styled from "styled-components";

/**everything based on Phase Interface*/

export const Phase = styled.div`
  position: relative;
  width: 250px;
  height:125px;
  display: inline-block;
  float: right;
  //flattens the curve of Phase
  border-radius: 25px/25px;
  
  background: #BDAF7E;
  border: 3px solid #000000;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

export const PhaseMessage = styled.div`
    position: absolute;
    top: 70px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-family: Happy Monkey;
    font-size: 24px;
    justify-content: center;
    display: flex;
`;

export const PhaseCircle = styled.div`
    position: absolute;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: #817857;
    top: 20px;
    border: 2px solid #000000;
`;
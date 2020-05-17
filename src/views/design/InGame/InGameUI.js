import styled from "styled-components";

/**everything based on InGame Background*/

export const EasterEgg = styled.img`
  position: fixed;
  z-index: 2;
  display: none;
  width: 100%;
`;

export const BoardContainer = styled.div`
  width: 550px;
  height: 300px;
  display: inline-block;
  
  position: relative;
`;

export const Game = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  //padding based on the resolution of the screen
  padding-top: 2%;
  padding-bottom: 1%;
  padding-left: 2%;
  padding-right: 2%;
  margin-left: auto;
  margin-right: auto;
  //min width and height of the game: prevents distortion
  min-width: 1366px;
  min-height: 768px;
  
  background: linear-gradient(180deg, #005C0F 0%, rgba(0, 147, 23, 0) 100%), #05F400;
`;

export const HUDContainer = styled.div`
`;

export const Table = styled.div`
  width: 1000px;
  height: 500px;
  border-radius: 1000px/500px;
  
  //allows player HUD to overlap the Table (ich bin so ein genius guy)
  margin-top: -225px;
  margin-bottom: -200px;
  
  align-items: center;
  justify-content: center;
  display: fix;
  
  background: linear-gradient(180deg, #CF7C00 0%, rgba(147, 88, 0, 0.0302086) 96.98%, rgba(114, 68, 0, 0) 100%), #773900;
  border: 3px solid #000000;
  box-sizing: border-box;
  box-shadow: 20px 30px 30px rgba(0, 0, 0, 0.25);
`;


export const TableContainer = styled.div`
  display: fix;
  align-items: center;
  justify-content: center;
`;

export const EndGameContainer = styled.div`  
  border-radius: 20px;
  border: 3px solid black;

  margin: 0;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  
  width: 70%;
  height: 70%;
  
  position: absolute;
  
  background: #CBBD8C;
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  
  z-index: 2;
  display: none;
`;

export const GameOver = styled.div`
  height: 100px;
  width: 400px;
  margin: auto;
  
  position: relative;
  top: 30px;
  
  background: #FCC812;
  border: 3px solid #000000;
  border-radius: 20px;
  line-height: 100px;
  
  font-family: Happy Monkey;
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  text-transform: uppercase;
`;

export const Waiting = styled.div`
  font-family: Happy Monkey;
  font-size: 32px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 5px;
  top: 250px;
  position: relative;
`;

export const StatisticsContainer = styled.div`
  height: 100px;
  width: 100%;
  margin: auto;
  
  position: relative;
  top: 100px;
`;

export const Statistics = styled.div`
  font-family: Happy Monkey;
  font-size: 32px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 5px;
`;
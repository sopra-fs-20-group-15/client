import React, {Fragment} from "react";
import styled from "styled-components";


const GridNormalItem = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  font-family: Happy Monkey;
  font-size: 24px;
  outline-style: solid;

`;

const BotContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 3px 3px;
  background-color: #000000;
  position: relative;
  
  box-sizing: border-box;
  outline-style: solid;
`;

const BotCell = styled.li`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
  font-family: Happy Monkey;
  font-size: 24px;
`;


/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
function Lobby(lobby) {
  return (
    <Fragment>
        <GridNormalItem> {lobby.gameName} </GridNormalItem>
        <GridNormalItem> {lobby.gameType} </GridNormalItem>
        <GridNormalItem> {lobby.numOfActualPlayers}/{lobby.numOfDesiredPlayers} </GridNormalItem>
        <BotContainer>
            <BotCell> Angels: {lobby.numOfAngels} </BotCell>
            <BotCell> Devils: {lobby.numOfDevils}</BotCell>
        </BotContainer>
    </Fragment>
  );
}

export default Lobby;

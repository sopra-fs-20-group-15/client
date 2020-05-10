import React, {Fragment} from "react";
import {GuessedCardsField, InputField, NameField, NameFieldActivePlayer, Output, ScoreField, SignalField, Player} from "./design/InGame/PlayerUI";


/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const PlayerComponent = ({ scores, guessedCards, clonePlayers, activePlayer, number }) => {
  return (
    <Fragment>
        <GuessedCardsField style={{top: "10%", left: "8%"}}/>
        <GuessedCardsField
            style={{top: "5%", left: "12%"}}>{guessedCards[number-1]}</GuessedCardsField>
        <ScoreField>{scores[number-1]}</ScoreField>
        {clonePlayers[number-2] !== activePlayer ?
            <NameField>6. {clonePlayers[number-2]}</NameField> :
            <NameFieldActivePlayer>6. {clonePlayers[number-2]}</NameFieldActivePlayer>}
        <InputField>
            <Output id={"clue" + number}/>
        </InputField>
        <SignalField id={"field"+number}/>
    </Fragment>
  );
};

export default PlayerComponent;

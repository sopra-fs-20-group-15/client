import React, {Fragment} from "react";
import {GuessedCardsField, InputField, NameField, NameFieldActivePlayer, Output, ScoreField, SignalField} from "./design/InGame/PlayerUI";


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

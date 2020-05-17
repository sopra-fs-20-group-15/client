import React, {Fragment} from "react";
import {EasterEgg} from "./design/InGame/InGameUI";
import easterEgg1 from "./pictures/easter eggs/wow.gif";
import easterEgg2 from "./pictures/easter eggs/beautiful_squidward.gif";
import easterEgg3 from "./pictures/easter eggs/chicken_dance.gif";
import easterEgg4 from "./pictures/easter eggs/trump.gif";
import easterEgg5 from "./pictures/easter eggs/simpsons.gif";
import easterEgg6 from "./pictures/easter eggs/pepe.gif";


const EasterEggs = () => {
  return (
    <Fragment>
        <EasterEgg id={"wow"} src={easterEgg1} alt={"easter egg"}/>
        <EasterEgg id={"pure beauty"} src={easterEgg2} alt={"easter egg"}/>
        <EasterEgg id={"rachid"} src={easterEgg3} alt={"easter egg"}/>
        <EasterEgg id={"mexicans"} src={easterEgg4} alt={"easter egg"} style={{width: "50%", left: "30%"}}/>
        <EasterEgg id={"milestone 4 abgabe"} src={easterEgg5} alt={"easter egg"}/>
        <EasterEgg id={"hate crime"} src={easterEgg6} alt={"easter egg"} style={{width: "50%", left: "30%"}}/>
    </Fragment>
  );
};

export default EasterEggs;

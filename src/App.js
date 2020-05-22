import React, { Component } from "react";
import {Helmet} from "react-helmet";
import AppRouter from "./components/shared/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 */
class App extends Component {
  render() {
    return (
      <div>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Just One </title>
            <link rel="canonical" href="https://sopra-fs20-group-15-client.herokuapp.com" />
              <meta name="A fun multiplayer game for 3 to 7 people!"/>
              <meta property="og:image" content="./pictures/JustOneLogo.png" />
          </Helmet>
        <AppRouter />
      </div>
    );
  }
}

export default App;

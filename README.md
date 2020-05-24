# Just One
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=sopra-fs-20-group-15_client&metric=alert_status)](https://sonarcloud.io/dashboard?id=sopra-fs-20-group-15_client)

This project aims to recreate the popular table top game "Just One" as a web application, while staying as true to the 
original as possible. 

The goal of this web application is to allow for players around the world to play "Just One" together. This application 
allows for players to add bots to their games (which as of now can only be passive players), if they do not have enough 
players to play a game or simply want more players in the game. It's also possible to play a game without having other 
human co-players as long as you add at least two bots to meet the minimum required player size of three.

The web application is implemented in a way that it recognizes if a player has left the game during a game session and 
replaces the missing player with a bot at the end of the turn.

This repository implements the client side of the said web application. To view the server side, please visit the 
following git repository: https://github.com/sopra-fs-20-group-15/server.git

## Technologies Used
This project is written in Javascript and uses the React library for building user interfaces. It also uses CSS for 
styling the interfaces. The Client and Server communicate to each other through REST API Calls. This is also the 
reason why this project is implemented with Spring Boot, which allows for easy management of REST endpoints. It also 
uses GitHub for versioning control and software development.

## High-Level Components
We can split the Client in three components: pre-game, in-game and post-game.

### Pre-Game
The pre-game components handle the process of registering a user account and preparing and starting a game.

#### Login and Register
With the components [Login](src/components/login/Login.js) and [Register](src/components/register/Register.js), the 
User can register an account and log in with it. All functions like registering an account or logging in are handled in 
the Server while the Client is sending API requests (Full list of the API request specifications available in the [Materials](https://github.com/sopra-fs-20-group-15/Material) 
folder in GitHub). Sometimes, a requestBody with specific information is also needed.

By logging in, a token is saved in the browser, which is used for guarding the pages after the Login Page. The Guards in 
the [routeProtectors folder](src/components/shared/routeProtectors) handle unauthorized access of pages, where it is 
required that the user is logged in.

#### Rules and Tutorial
[Rules](src/components/Rules/Rules.js) and [Tutorial](src/components/Tutorial/Tutorial.js) provides the user useful pages
to let the user learn how to play the game. If the user doesn't know the Rules, he can read it up here. The tutorial page
is a mock-up of the Game page. The user can simulate a game round in it.

The Tutorial components shares some methods with the [InGame](src/components/InGame/InGame.js) component (updatePhase() 
and handleInput()), which are further explained in the paragraph In-Game.

#### Creating and Joining a Lobby
The components [LobbyOverview](src/components/LobbyOverview/LobbyOverview.js), [CreateGame](src/components/CreateGame/CreateGame.js) 
and [Lobby](src/components/Lobby/Lobby.js) handles everything that is needed, before the actual game can start. The CreateGame
component provides the user with an efficient interface that let the user creates a GameSetUp (in the backend), which 
can be seen as lobbies and be joined in the LobbyOverview interface. The user can choose the maximum amount of players, 
amount of bots and optional password for the lobby. The creator of the lobby can manually start the game or terminate 
the lobby. There is also a chat in the Lobby interface, so that users can communicate with each other.

In order to keep the LobbyOverview updated, the getLobbies() method is called every second, rendering the page new, whe
there's a new lobby or a lobby deleted. This method of polling information from the backend in an interval is used in the
next components too.

### In-Game
#### In-Game UI
The [InGame](src/components/InGame/InGame.js) component handles everything that has to do with the actual game and the 
game flow. The interface provides the user with a field as input options and many information resources like a HUD with a timer
and a phase indicator, a display for every player and the current card and deck size. A banner that shows up every phase
informs what the user has to do on each phase. Some key methods of the InGame component are listed here below:

* handlePolling(): This method gets all the needed information from the backend in order to play this game. To keep the 
game updated, it calls every 0.75 seconds many gets methods depending on which phase the player is at the moment.

* updatePhase(): This method updates the UI depending on the information from handlePolling() it gets. It also changes
the phase of the game (the frontend handles the change of phase not the backend, because this way of handling is more stable
based on how the server's information on phases).

* handleInput(): This method ensures, that players send the right API request based on the current phase and the player.
It checks in which phase the game currently is and if the player is an active or a passive player.

* componentDidMount(): This method handles the case, if a player would leave the game for a short while or refreshes the 
page, so that he comes back to the current game phase and with the current time. Without this method, the phase and timer
of that player would by not in synced with the other players.

* isStillAlive(): This method handles the problem, if a player would leave the game without pressing on the "leave game" 
button. The method sends an request to the backend every 2 seconds so that the backend knows, if the player is still playing
the game. If he leaves the game page for a longer period of time, he will be replaced by an bot.

### Post-Game
#### Leaderboard
The [Leaderboard](src/components/Leaderboard/Leaderboard.js) displays the scores and games played from each player. The 
information are sent from the backend by calling the getPlayers() method in componentDidMount(). It is called before the 
page is rendered, so that the Leaderboard can be displayed instantly.

## Launch and Deployment
This section covers how to launch and deploy the client side of the application. To view how to do the same for the server 
side, please visit the following git repository: https://github.com/sopra-fs-20-group-15/server.git
 
For your local development environment you'll need Node.js >= 8.10. You can download it [here](https://nodejs.org). All 
other dependencies including React get installed with:

### `npm install`

This has to be done before starting the application for the first time (only once).

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console (use Google Chrome!).

### `npm run test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


This project is set to deploy to Heroku (production build) and SonarCloud (quality control). This is done by using Github 
Actions. If you wish to deploy to your own Heroku and SonarCloud accounts you will have to create the corresponding 
secrets mentioned in [deploy.yml](.github/workflows/deploy.yml) (config file) for your branch / fork.

## Illustrations
FORTSETZUNG FOLGT

## Roadmap
For any developers wanting to fork this project or contribute to this project by implementing new features, we highly
 recommend implementing following features:
 
 * Implementing more sound effects or graphical effects to make the game more intuitive.
 * Adding more personalization options by implementing a profile page that can be edited.
 * Adding the possibilities to include additional rules in the [CreateGame](/src/components/CreateGame/CreateGame.js) component.
 * Implementing friend lists and friend request in order to play with friends and invite them into lobbies.
 * Refactoring [InGame](/src/components/InGame/InGame.js) so that it becomes more readable and smaller.


## Authors and Acknowledgement
Contributors to this project in alphabetical order:

 * Cedeño, Jordan
 * Eder, Charlotte
 * Haemmerli, Raphael
 * Mitiyamulle Arachchige, Kai
 * Vu, Minh Phuong

Special Thanks to:

 * Scheitlin, Alex (Teaching Assistant, General Development Advisor)
 * Friends and Family (Further Beta Testers)

## License
Copyright 2020 SoPra Group 15

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
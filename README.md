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

##Technologies Used
This project is written in Javascript and uses the React library for building user interfaces. It also uses CSS for 
styling the interfaces. The Client and Server communicate to each other through REST API Calls. This is also the 
reason why this project is implemented with Spring Boot, which allows for easy management of REST endpoints. It also 
uses GitHub for versioning control and software development.

This project is set to deploy to Heroku (running build on the web) and SonarCloud (quality control). If you wish to 
deploy to your own Heroku and SonarCloud create secrets for the secrets in [deploy.yml](.github/workflows/deploy.yml).

## High-Level Components
We can split the Client in three components: pre-game, in-game and post-game.

### Pre-Game
The pre-game components handle the process of registering a user account and preparing and starting a game.

#### LOLOL

* With the components [Login](src\components\login\Login.js) and [Register](src\components\register\Register.js), the 
User can register an account and log in with it. All functions like registering an account or logging in are handled in 
the Server while the Client is sending API requests (Full list of the API request specifications available in the [Materials](https://github.com/sopra-fs-20-group-15/Material) 
folder in GitHub). Sometimes, a requestBody with specific information is also needed. By logging in, a token is saved in 
the browser, which is used for guarding the pages after the Login Page. The Guards in the [routeProtectors folder](src\components\shared\routeProtectors) 
handle unauthorized access of pages, where it is required that the user is logged in.

* [Rules](src/components/Rules/Rules.js) and [Tutorial](src/components/Tutorial/Tutorial.js) provides the user useful pages
to let the user learn how to play the game. If the user doesn't know the Rules, he can read it up here. The tutorial page
is a mock-up of the Game page. The user can simulate a game round in it. The Tutorial components shares some methods and
components with the [InGame](src/components/InGame/InGame.js) components, which are further explained in the paragraph 
In-Game.

* The components [LobbyOverview](src\components\LobbyOverview\LobbyOverview.js), [CreateGame](src\components\CreateGame\CreateGame.js) 
and [Lobby](src\components\Lobby\Lobby.js) handles everything that is needed, before the actual game can start. The CreateGame
component provides the user with an efficient interface that let the user creates a GameSetUp (in the backend), which 
can be seen as lobbies and be joined in the LobbyOverview interface. The user can choose the maximum amount of players, 
amount of bots and optional password for the lobby. The creator of the lobby can manually start the game or terminate 
the lobby. There is also a chat in the Lobby interface, so that users can communicate with each other.
In order to keep the LobbyOverview updated, the getLobbies() method is called every second, rendering the page new, whe
there's a new lobby or a lobby deleted. This method of polling information from the backend in an interval is used in the
next components too.

### In-Game
* The [InGame](src/components/InGame/InGame.js) compoment handles everything that has to do with the actual game and the 
gameflow. The interface provides the user with a field as input options and many information resources like a HUD with a timer
and a phase indicator, a display for every player and the current card and deck size. A banner that shows up every phase
informs what the user has to do on each phase. Some key methods of the InGame component are listed here below:

handlePolling():

updatePhase():

handleInput():

componentDidMount():

isStillAlive():

### Post-Game
* The [Leaderboard](src/components/Leaderboard/Leaderboard.js) displays the scores and games played from each player. The 
informations are sent from the backend by calling the getPlayers() method in componentDidMount(). It is called before the 
page is rendered, so that the Leaderboard can be displayed instantly.

## Launch and Deployment
 
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

## Illustrations
FORTSETZUNG FOLGT

## Roadmap
For any developers wanting to fork this project or contribute to this project by implementing new features, we highly
 recommend implementing following features:
 
 * Implementing more sound effects or graphical effects to make the game more intuitive.
 * Adding more personalization options by implementing a profile page that can be edited.
 * Adding the possibilities to include additional rules in the [CreateGame](/src/components/CreateGame/CreateGame.js) component.
 * Implementing friend lists and friend request in order to play with friends and invite them into lobbies.
 * Refactoring [Ingame](/src/components/InGame/InGame.js) so that it becomes more readable and smaller.


## Authors and Acknowledgement
Contributors to this project in alphabetical order:

 * Cedeño, Jordan
 * Eder, Charlotte
 * Haemmerli, Raphael
 * Mitiyamulle Arachchige, Kai
 * Vu, Minh Phuong

Special Thanks to:

 * Scheitlin, Alex (Teaching Assistant, General Development Advisor)
 * Enis, Peter (Main Beta Tester)
 * Friends and Family (Further Beta Testers)

## License
FORTSETZUNG FOLGT












# SoPra FS20 - Client Template

## Getting started with React

Read and go through those Tutorials, It will make your life easier!

- Read the React [Docs](https://reactjs.org/docs/getting-started.html)
- Do this React [Getting Started](https://reactjs.org/tutorial/tutorial.html) Tutorial (it doesn’t assume any existing React knowledge)
- Get an Understanding of [CSS](http://localhost:3000) and [HTML](https://www.w3schools.com/html/html_intro.asp)!

Once you have done all of this, in the template there are two main external dependencies that you should look at:

- [styled-components](https://www.styled-components.com/docs)
  It removes the mapping between components and styles (i.e. external css files). This means that when you're defining your styles, you're actually creating a normal React component, that has your styles attached to it
* [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) Declarative routing for React being a collection of navigational components that compose declaratively with your application. 

<!-- ## IDE Recommendation
As a student, you have the possibility with [JetBrains](https://www.jetbrains.com/student/) to obtain a free individual license and have access to several IDEs. 
We recommend you to use [WebStorm](https://www.jetbrains.com/webstorm/specials/webstorm/webstorm.html?gclid=EAIaIQobChMIyPOj5f723wIVqRXTCh3SKwtYEAAYASAAEgLtMvD_BwE&gclsrc=aw.ds) for your front-end. 
Once you have downloaded and installed it, you can add the following WebStorm plugins: 
> Go to Preferences > Plugins > Browse Repositories and look for: 
* [styled-components](https://plugins.jetbrains.com/plugin/9997-styled-components) (provides coding assistance like CSS Highlighting for Styled Components)
* [prettier](https://plugins.jetbrains.com/plugin/10456-prettier) (a smart code formatter)
* [Material Theme UI](https://plugins.jetbrains.com/plugin/8006-material-theme-ui) (Material Theme for Jetbrains IDEs, allowing a total customization of the IDE including Themes, Color Schemes, Icons and many other features.)

Feel free to use other IDEs (e.g. [VisualStudio](https://code.visualstudio.com/)) if you want.  -->

## Prerequisites and Installation

For your local development environment you'll need Node.js >= 8.10. You can download it [here](https://nodejs.org). All other dependencies including React get installed with:

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

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).


>Thanks to Lucas Pelloni for the template

test_kai

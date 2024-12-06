const prompt = require("prompt-sync")({ sigint: true });

// Constant Game Elements
const HAT = "^";
const HOLE = "O";
const GRASS = "░";
const PLAYER = "*";

// Constant Game Scenarios (Messages)
const WIN = "Congratulations! You win!";                                        /* WIN */
const LOSE = "You lose!";                                                       /* LOSE */
const OUT_BOUND = "You are out of the field.";                                  /* OUT-OF-BOUNDS */
const INTO_HOLE = "You fell into a hole";                                       /* FALLEN INTO HOLE */
const WELCOME = "Welcome to Find Your Hat game";                                /* START OF GAME WELCOME MESSAGE */
const DIRECTION = "Which direction, up(u), down(d), left(l) or right(r)?";      /* KEYBOARD DIRECTIONS */
const QUIT = "Press q or Q to quit the game.";                                  /* KEYBOARD TO QUIT THE GAME */
const END_GAME = "Game Ended. Thank you.";                                      /* ENDED THE GAME */
const NOT_RECOGNISED = "Input not recognised.";                                 /* INPUT NOT RECOGNISED */

class Field {
  // constructor
  constructor(rows, cols, holes) {
    this.rows = rows;
    this.cols = cols;
    this.holes = holes;
    this.field = new Array();                                                   /* Property that represents the field for game */
    this.gamePlay = false;                                                      /* Property to setup the gameplay */
  }

  // Start of methods
  static welcomeMsg(msg) {                                                      /* Welcome message */
    console.log(
      "\n**********************************\n" +
        msg +
        "\n**********************************\n"
    );
  }
                                                                                // TODO WHERE WE RANDOMISE THE FIELD WITH HAT, HOLE AND GRASS (GENERATE FIELD)
  // Generate the game's field method
  generateField() {
    for (let i = 0; i < this.rows; i++) {                                       /* Generate field rows */
      this.field[i] = new Array();                                      

      for (let j = 0; j < this.cols; j++) {                                     /* Generate field cols */
        this.field[i][j] = GRASS;
      }
    }
                                                                                // TODO THE NUMBER OF HOLES CREATED SHOULD PROVIDE SUFFICIENT CHALLENGE FOR THE GAME
    const avoid = [[0, 0], [0, 1], [1, 0], [1, 1]];                             /* Coordinates to avoid near the player's starting location */

    for (let h = 0; h < this.holes; h++) {                                      /* Loop the number of holes to be placed, and randomize their positions */
      let rowIndex = Math.floor(Math.random() * this.rows);
      let colIndex = Math.floor(Math.random() * this.cols);
                                                                                // TODO THE HOLES SHOULD NOT BLOCK THE PLAYER FROM MOVING AT THE START OF THE GAME
      if (this.field[rowIndex][colIndex] === GRASS &&
        !avoid.some((pos) => pos[0] === rowIndex && pos[1] === colIndex)        /* Used .some() statement to avoid generating holes around and on player and check for true/false */
      )
        this.field[rowIndex][colIndex] = HOLE;
      else h--;
    }

    for (let k = 0; k < 1; k++) {                                                /* Randomize hat position */
      let rowIndex = Math.floor(Math.random() * this.rows);
      let colIndex = Math.floor(Math.random() * this.cols);

      if (this.field[rowIndex][colIndex] === GRASS &&
        !avoid.some((pos) => pos[0] === rowIndex && pos[1] === colIndex)         /* Used .some() statement to avoid generating hat around and on player */
      )
        this.field[rowIndex][colIndex] = HAT;
      else k--;
    }
  }

  // Print out the game field method
  printField() {
    this.field.forEach(element => console.log(element.join("")));
  }

  // Start game method
  startGame() {
    this.gamePlay = true;
    this.difficultyLevel();
    this.generateField(this.rows, this.cols);                                    /* Generate the field first */
    this.playerCurrentRow = 0;                                                   /* Current row index player is standing on at the start of game */
    this.playerCurrentCol = 0;                                                   /* Current col index player is standing on at the start of game */
    this.field[this.playerCurrentRow][this.playerCurrentCol] = PLAYER;           /* Set the start position of the character */
    this.printField();                                                           /* Print the field once */
    this.updateGame();                                                           /* Update the game once */
  }

  // Update game method
  updateGame() {
    let userInput = "";                                                          /* Obtain user input */

    do {                                                                         /* Get the user's direction */
      console.log(DIRECTION.concat(" ", QUIT));                                  /* Request for the user's input */
      userInput = prompt();

      switch (userInput.toLowerCase()) {                                         /* Update the position of the player */
                  
        case "u":
        case "d":
        case "l":
        case "r":
          this.updatePlayer(userInput.toLowerCase());                            /* User has pressed "u", "d", "l", "r" */
          break;
        case "q":
          this.endGame();                                                        /* User has quit the game */
          break;
        default:
          console.log(NOT_RECOGNISED);                                           /* Input not recognised */
          break;
      }

      this.printField();                                                         /* Print field */
    } while (userInput.toLowerCase() !== "q");                                   /* Continue to loop if the player hasn't quit */
  }

  // End game method
  endGame() {
    console.log(END_GAME);                                                       /* Inform the user the game has ended */
    this.gamePlay = false;                                                       /* Set gamePlay to false */
    process.exit();                                                              /* Quit the program */
  }

  // !! FOR THE ASSESSMENT
  // Update player position method
  updatePlayer(position) {                                                       /* Update the player's movement and game condition */
                                                                                 // TODO FIRST update the player's position in the field
    let currentRow = this.playerCurrentRow;
    let currentCol = this.playerCurrentCol;

    switch (position) {
      case "u":
        this.playerCurrentRow -= 1;
        break;
      case "d":
        this.playerCurrentRow += 1;
        break;
      case "l":
        this.playerCurrentCol -= 1;
        break;
      case "r":
        this.playerCurrentCol += 1;
        break;
      default:
        console.log("Please input a valid input!!");
        return;
    }
                                                                                  // TODO check if the player has gotten out of bounds - if yes (lOSE) and endGame()
    if (this.playerCurrentRow < 0 || this.playerCurrentRow >= this.rows ||        /* Check if the new position is within bounds*/
        this.playerCurrentCol < 0 || this.playerCurrentCol >= this.cols) {
        console.log(OUT_BOUND);                                                   /* Console log out of bounds message */
        console.log(LOSE);                                                        /* Console log lose message */
        this.endGame();                                                           /* End game due to out of bounds */
    }
                                                                                  // TODO check if the player has fallen into hole - if yes (LOSE) and endGame()
    else if (this.field[this.playerCurrentRow][this.playerCurrentCol] === HOLE) {
      console.log(INTO_HOLE);                                                     /* Console log player fell into a hole message */
      console.log(LOSE);                                                          /* Console log lose message */
      this.endGame();                                                             /* End game due to out of bounds */
    }
                                                                                  // TODO check if the player has found the hat - if yes (WIN) and endGame()
    else if (this.field[this.playerCurrentRow][this.playerCurrentCol] === HAT) {
      console.log(WIN);                                                           /* Console log win message */
      this.endGame();                                                             /* End game as player has won */
    }

    this.field[currentRow][currentCol] = PLAYER;                                  /* Leave a trail by marking the old position with PLAYER element */
    this.field[this.playerCurrentRow][this.playerCurrentCol] = PLAYER;            /* Update the new position with the PLAYER element */

    console.log("player has moved: " + position);
  }

  // Difficulty selection method
  difficultyLevel() {                                                             /* Implemented difficulty level */
    console.log("Difficulty: Please select between Easy, Medium or Hard!");
    let level = prompt().toLowerCase();                                           /* Prompt to allow player to select difficulty between Easy, Medium and Hard */

    const difficultyChoice = {
      easy: { rows: 10, cols: 10, holes: 3 },
      medium: { rows: 13, cols: 13, holes: 15 },
      hard: { rows: 15, cols: 15, holes: 30 },
    };

    if (difficultyChoice[level]) {
      this.rows = difficultyChoice[level].rows;
      this.cols = difficultyChoice[level].cols;
      this.holes = difficultyChoice[level].holes;
    } else {
      console.log("Invalid level/input. Default Easy mode selected.");
      this.rows = difficultyChoice.easy.rows;
      this.cols = difficultyChoice.easy.cols;
      this.holes = difficultyChoice.easy.holes;
    }
  }
  
  // End of methods
}

Field.welcomeMsg(WELCOME);                                                        /* Static method to welcome the player */

const field = new Field(10, 10);                                                  /* Declaring and creating an instance of Field class */
field.startGame();                                                                /* Start the game */

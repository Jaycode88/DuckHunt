/**  make gameCanvas and score visible and hide welcome container when start game is clicked */
document.getElementById('startGameBtn').addEventListener('click', function() {
    startGame();
});

document.querySelectorAll('.how-to').forEach(button => {
    button.addEventListener('click', function() {
        var howToPlayModal = new bootstrap.Modal(document.getElementById('howToPlayModal'));
        howToPlayModal.show();
    });
});

document.getElementById('startGameFromModalBtn').addEventListener('click', function() {
    var howToPlayModal = bootstrap.Modal.getInstance(document.getElementById('howToPlayModal'));
    howToPlayModal.hide();
    startGame();
});

// Get the canvas element and its context for drawing
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize the score and the duck object
let score = 0;
let duck = null; // Only one duck
const scoreDisplay = document.getElementById('score');

// Modal elements
const gameOverModal = document.getElementById('gameOverModal');
const closeModal = document.getElementById('closeModal');
const restartButton = document.getElementById('restartButton');
const finalScore = document.getElementById('finalScore');

// Set the canvas dimensions
canvas.width = 1000;
canvas.height = 571;

// Add click event listener to the canvas for shooting the duck
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (duck && !duck.isDead && duck.isHit(x, y)) {
        duck.isDead = true;
        score += 2;
        updateScore();
    }
});

/**
 * Update the score display in the HTML.
 */
function updateScore() {
    scoreDisplay.textContent = score; // Update the score display element
}

/**
 * Import route functions.
 */
import { diamondRoute } from './routes/diamondRoute.js';
import { sineWave } from './routes/sinewave.js';
import { customRoute1 } from './routes/custom1.js';
import { customRoute2 } from './routes/custom2.js';
import { customRoute3 } from './routes/custom3.js';
import { customRoute4 } from './routes/custom4.js';
import { customRoute5 } from './routes/custom5.js';
import { customRoute6 } from './routes/custom6.js';

// Array of route functions for the duck to follow
const routes = [
    customRoute6,
    customRoute5,
    customRoute4,
    customRoute3,
    customRoute2,
    customRoute1,
    sineWave,
    diamondRoute,
];

// Add duck counter
let duckCounter = 0;
const maxDucks = 15;
let gameOver = false;

/**
 * Class representing a Duck.
 */
class Duck {
    constructor() {
        this.t = 0;
        this.speed = 0.001 + Math.random() * 0.002;
        this.route = routes[Math.floor(Math.random() * routes.length)];
        this.imageLeft = new Image();
        this.imageLeft.src = 'assets/images/flipped-100pxwidth-duck-dall-e.png';
        this.imageRight = new Image();
        this.imageRight.src = 'assets/images/100pxwidth-duck-dall-e.png';
        this.imageDead = new Image();
        this.imageDead.src = 'assets/images/100pxwidth-deadduck-dall-e.png';
        this.isDead = false;
        this.prevX = null;
        this.prevY = null;
        this.completedRoutes = 0;
        this.finalX = null; // Store final fall position
        this.finalY = null;
    }

    draw() {
        let img;
        if (this.isDead) {
            img = this.imageDead;
        } else {
            if (this.prevX !== null && this.x !== this.prevX) {
                img = this.x > this.prevX ? this.imageRight : this.imageLeft;
            } else {
                img = this.x < canvas.width / 2 ? this.imageRight : this.imageLeft;
            }
        }
        if (img.complete) {
            ctx.drawImage(img, this.x, this.y, 100, 100);
        } else {
            img.onload = () => ctx.drawImage(img, this.x, this.y, 100, 100);
        }
    }

    update() {
        if (this.isDead) {
            this.y += this.speed * 3000; // Duck falls down when dead
            if (this.y > canvas.height) {
                this.finalX = this.x > 800 ? 800 : this.x; // Adjust position if duck is too close to the right edge
                this.finalY = canvas.height;
                handleDogDuckAndNextDuck(this.finalX, this.finalY); // Trigger dogduck and next duck logic
            }
        } else {
            this.t += this.speed;
            if (this.t > 1) {
                this.t = 0;
                this.completedRoutes++;
                if (this.completedRoutes >= 2) {
                    score -= 1;
                    updateScore();
                    handleDogAndNextDuck();
                }
            } else {
                this.prevX = this.x;
                this.prevY = this.y;
                this.route(this, this.t);
            }
        }
    }

    isHit(x, y) {
        return x >= this.x && x <= this.x + 100 && y >= this.y && y <= this.y + 100;
    }
}

/**
 * Class representing the game
 */
class DuckHuntGame {
    constructor() {
        this.dogLaughing = new Image();
        this.dogLaughing.src = 'assets/images/doglaugh.png';
        this.dogDuck = new Image();
        this.dogDuck.src = 'assets/images/dogduck.png';
        this.dogVisible = false;
        this.dogDuckVisible = false;
        this.dogY = canvas.height;
        this.dogSpeed = 5;
        this.gamePaused = false;
        this.dogX = 0;
    }

    showDog() {
        this.dogVisible = true;
        this.dogY = canvas.height;
    }

    hideDog() {
        this.dogVisible = false;
    }

    showDogDuck(x) {
        this.dogDuckVisible = true;
        this.dogX = x;
        this.dogY = canvas.height;
    }

    hideDogDuck() {
        this.dogDuckVisible = false;
    }
}

const game = new DuckHuntGame();

/**
 * Handle dog duck animation and next duck spawning when duck is shot
 */
function handleDogDuckAndNextDuck(x, y) {
    game.gamePaused = true; // Pause the game
    game.showDogDuck(x); // Show dog with duck at the final fall position
    setTimeout(() => {
        game.hideDogDuck();
        setTimeout(() => {
            game.gamePaused = false; // Resume the game
            if (duckCounter < maxDucks) {
                spawnDuck(); // Spawn a new duck if the limit is not reached
            } else {
                showGameOver();
            }
        }, 500); // Additional delay before spawning the next duck or showing game over
    }, 1000); // DogDuck stays for 1 second
}

/** Handle dog laugh animation when duck is not shot */
function handleDogAndNextDuck() {
    game.gamePaused = true; // Pause the game
    game.showDog(); // Show the dog laughing
    setTimeout(() => {
        game.hideDog();
        setTimeout(() => {
            game.gamePaused = false; // Resume the game
            if (duckCounter < maxDucks) {
                spawnDuck(); // Spawn a new duck if the limit is not reached
            } else {
                showGameOver();
            }
        }, 500); // Additional delay before spawning the next duck or showing game over
    }, 1000); // DogLaugh stays for 1 second
}

/**
 * Show Game Over modal
 */
function showGameOver() {
    gameOver = true;
    finalScore.textContent = `You scored: ${score}`;
    gameOverModal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
    gameOverModal.style.display = 'none';
    document.querySelector('.welcome-container').style.display = 'block';
    document.getElementById('gameCanvasContainer').style.display = 'none';
    document.querySelector('.score-box').style.display = 'none';
    resetGame(); // Reset the game state
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == gameOverModal) {
        gameOverModal.style.display = 'none';
        document.querySelector('.welcome-container').style.display = 'block';
        document.getElementById('gameCanvasContainer').style.display = 'none';
        document.querySelector('.score-box').style.display = 'none';
        resetGame(); // Reset the game state
    }
}

//Reset the game state
function resetGame() {
    gameOver = false;
    score = 0;
    duckCounter = 0;
    updateScore();
    duck = null;
}


// Restart the game
restartButton.onclick = function() {
    // Reset game state
    gameOver = false;
    score = 0;
    duckCounter = 0;
    updateScore();
    gameOverModal.style.display = 'none'; // Hide the modal
    startGame(); // Start a new game
};

/**
 * Update the game state and redraw the canvas.
 */
function updateGame() {
    if (gameOver) return; // Exit the function to stop the game

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    if (!game.gamePaused && duck) {
        duck.update(); // Update the duck's position
        duck.draw(); // Draw the duck on the canvas
    }

    // Animate the dog
    if (game.dogVisible) {
        if (game.dogY > canvas.height / 2 - 100) {
            game.dogY -= game.dogSpeed;
        }
        ctx.drawImage(game.dogLaughing, canvas.width / 2 - 100, game.dogY, 200, 200);
    }

    // Display the dog with duck
    if (game.dogDuckVisible) {
        if (game.dogY > canvas.height / 2 - 100) {
            game.dogY -= game.dogSpeed;
        }
        ctx.drawImage(game.dogDuck, game.dogX, game.dogY, 200, 200);
    }

    requestAnimationFrame(updateGame); // Repeat the loop for smooth animation
}

/**
 * Spawn a new duck.
 */
function spawnDuck() {
    if (duckCounter < maxDucks) {
        duck = new Duck(); // Create a new duck instance
        duckCounter++;
    }
}

// Start a new game function
function startGame() {
    document.querySelector('.welcome-container').style.display = 'none';
    document.getElementById('gameCanvasContainer').style.display = 'block';
    document.querySelector('.score-box').style.display = 'inline-block';
    // Scroll the game canvas container into view
    document.getElementById('gameCanvasContainer').scrollIntoView({ behavior: 'smooth' });

    // Start the game by spawning the first duck and beginning the update loop
    spawnDuck();
    updateGame();
}

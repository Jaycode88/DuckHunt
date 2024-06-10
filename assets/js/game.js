// Get the canvas element and its context for drawing
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize the score and the duck object
let score = 0;
let duck = null; // Only one duck
const scoreDisplay = document.getElementById('score');

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

// Array of route functions for the duck to follow
const routes = [
    customRoute5,
    customRoute4,
    customRoute3,
    customRoute2,
    customRoute1,
    sineWave,
    diamondRoute,
];

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
            this.y += this.speed * 2000; // Duck falls down when dead
            if (this.y > canvas.height) {
                this.finalX = this.x > 800 ? 700 : this.x; // Adjust position if duck is too close to the right edge
                this.finalY = canvas.height;
                handleDogDuckAndNextDuck(this.finalX, this.finalY); // Trigger dogduck and next duck logic
            }
        } else {
            this.t += this.speed;
            if (this.t > 1) {
                this.t = 0;
                this.completedRoutes++;
                if (this.completedRoutes >= 3) {
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
 * Handle dog animation and next duck spawning when duck not shot
 */
function handleDogAndNextDuck() {
    game.gamePaused = true; // Pause the game
    setTimeout(() => {
        game.showDog();
        setTimeout(() => {
            game.hideDog();
            setTimeout(() => {
                game.gamePaused = false; // Resume the game
                spawnDuck(); // Wait another  second before spawning a new duck
            }, 1000); // Additional delay before spawning the next duck
        }, 2000); // Dog stays for 2 second
    }, 1000); // Initial delay of a second before showing the dog
}

/** Handle dogduck animation and next duck when duck is shot */
function handleDogDuckAndNextDuck(x, y) {
    game.gamePaused = true; // Pause the game
    game.showDogDuck(x); // Show dog with duck at the final fall position
    setTimeout(() => {
        game.hideDogDuck();
        setTimeout(() => {
            game.gamePaused = false; // Resume the game
            spawnDuck(); // Spawn a new duck
        }, 1000); // Additional delay before spawning the next duck
    }, 2000); // DogDuck stays for 2 seconds
}





/**
 * Update the game state and redraw the canvas.
 */
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!game.gamePaused && duck) {
        duck.update();
        duck.draw();
    }

    if (game.dogVisible) {
        if (game.dogY > canvas.height / 2 - 100) {
            game.dogY -= game.dogSpeed;
        }
        ctx.drawImage(game.dogLaughing, canvas.width / 2 - 100, game.dogY, 200, 200);
    }

    if (game.dogDuckVisible) {
        if (game.dogY > canvas.height / 2 - 100) {
            game.dogY -= game.dogSpeed;
        }
        ctx.drawImage(game.dogDuck, game.dogX, game.dogY, 200, 200);
    }

    requestAnimationFrame(updateGame);
}


/**
 * Spawn a new duck.
 */
function spawnDuck() {
    duck = new Duck(); // Create a new duck instance
}

// Start the game by spawning the first duck and beginning the update loop
spawnDuck();
updateGame();

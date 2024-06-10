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
        // Initialize the duck's position and route
        this.t = 0; // Parameter to track the position along the route (0 to 1)
        this.speed = 0.001 + Math.random() * 0.002; // Slower speed of the duck along the route

        this.route = routes[Math.floor(Math.random() * routes.length)]; // Randomly select a route

        // Load images for the duck facing left, right, and dead
        this.imageLeft = new Image();
        this.imageLeft.src = 'assets/images/flipped-100pxwidth-duck-dall-e.png';
        this.imageRight = new Image();
        this.imageRight.src = 'assets/images/100pxwidth-duck-dall-e.png';
        this.imageDead = new Image();
        this.imageDead.src = 'assets/images/100pxwidth-deadduck-dall-e.png';

        this.isDead = false; // Track whether the duck is dead

        // Track the previous position
        this.prevX = null;
        this.prevY = null;

        this.completedRoutes = 0; // Track the number of completed routes
    }

    /**
     * Draw the duck on the canvas.
     */
    draw() {
        // Choose the appropriate image based on the duck's direction and state
        let img;
        if (this.isDead) {
            img = this.imageDead;
        } else {
            // Determine direction based on previous position
            if (this.prevX !== null && this.x !== this.prevX) {
                img = this.x > this.prevX ? this.imageRight : this.imageLeft;
            } else {
                img = this.x < canvas.width / 2 ? this.imageRight : this.imageLeft;
            }
        }

        // Draw the image on the canvas
        if (img.complete) {
            ctx.drawImage(img, this.x, this.y, 100, 100);
        } else {
            img.onload = () => ctx.drawImage(img, this.x, this.y, 100, 100);
        }
    }

    /**
     * Update the duck's position and handle boundary conditions.
     */
    update() {
        if (this.isDead) {
            this.y += this.speed * 1000; // Duck falls down when dead (adjust speed if necessary)
            if (this.y > canvas.height) {
                spawnDuck(); // Respawn a new duck if the current one falls off the canvas
            }
        } else {
            this.t += this.speed; // Move along the route
            if (this.t > 1) {
                this.t = 0; // Reset route progress
                this.completedRoutes++; // Increment completed routes

                if (this.completedRoutes >= 3) {
                    score -= 1; // Deduct 1 point if the duck completes its route 3 times
                    updateScore();
                    handleDogAndNextDuck(); // Trigger dog and next duck logic
                }
            } else {
                this.prevX = this.x;
                this.prevY = this.y;
                this.route(this, this.t); // Update position based on the route
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
        // Load dog images
        this.dogLaughing = new Image();
        this.dogLaughing.src = 'assets/images/doglaugh.png';

        // Dog state
        this.dogVisible = false;
        this.dogY = canvas.height; // Start below the canvas
        this.dogSpeed = 5; // Adjust speed as necessary

        // Game state
        this.gamePaused = false; // Control game state
    }

    showDog() {
        this.dogVisible = true;
        this.dogY = canvas.height; // Start below the canvas
    }

    hideDog() {
        this.dogVisible = false;
    }
}


const game = new DuckHuntGame();

/**
 * Handle dog animation and next duck spawning
 */
function handleDogAndNextDuck() {
    game.gamePaused = true; // Pause the game
    setTimeout(() => {
        game.showDog();
        setTimeout(() => {
            game.hideDog();
            setTimeout(() => {
                game.gamePaused = false; // Resume the game
                spawnDuck(); // Wait another 0.5 second before spawning a new duck
            }, 500); // Additional delay before spawning the next duck
        }, 1000); // Dog stays for 1 second
    }, 500); // Initial delay of 0.5 second before showing the dog
}

/**
 * Update the game state and redraw the canvas.
 */
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    if (!game.gamePaused && duck) {
        duck.update(); // Update the duck's position
        duck.draw(); // Draw the duck on the canvas
    }

    // Animate the dog
    if (game.dogVisible) {
        if (game.dogY > canvas.height / 2 - 100) {
            game.dogY -= game.dogSpeed; // Move the dog up
        }
        ctx.drawImage(game.dogLaughing, canvas.width / 2 - 100, game.dogY, 200, 200);
    }

    requestAnimationFrame(updateGame); // Repeat the loop for smooth animation
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

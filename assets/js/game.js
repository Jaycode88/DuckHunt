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

/**
 * Update the score display in the HTML.
 */
function updateScore() {
    scoreDisplay.textContent = score; // Update the score display element
}

/**
 * import route functions.
 */
import { diamondRoute } from './routes/diamondRoute.js';
import { sineWave } from './routes/sinewave.js';
import { zigZag } from './routes/zigZag.js';

// Array of route functions for the duck to follow
const routes = [
    
    zigZag,
];

/**
 * Class representing a Duck.
 */
class Duck {
    constructor() {
        // Initialize the duck's position and route
        this.t = 0; // Parameter to track the position along the route (0 to 1)
        this.speed = 0.002 + Math.random() * 0.004; // Slower speed of the duck along the route

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
            this.y += this.speed * 200; // Duck falls down when dead (adjust speed if necessary)
            if (this.y > canvas.height) {
                spawnDuck(); // Respawn a new duck if the current one falls off the canvas
            }
        } else {
            this.t += this.speed; // Move along the route
            if (this.t > 1) {
                spawnDuck(); // Respawn a new duck if it completes the route
            } else {
                // Update previous position before applying the new one
                this.prevX = this.x;
                this.prevY = this.y;
                
                this.route(this, this.t); // Update position based on the route
            }
        }
    }
}


/**
 * Spawn a new duck.
 */
function spawnDuck() {
    duck = new Duck(); // Create a new duck instance
}

/**
 * Update the game state and redraw the canvas.
 */
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    
    if (duck) {
        duck.update(); // Update the duck's position
        duck.draw(); // Draw the duck on the canvas
    }
    
    requestAnimationFrame(updateGame); // Repeat the loop for smooth animation
}

// Start the game by spawning the first duck and beginning the update loop
spawnDuck();
updateGame();

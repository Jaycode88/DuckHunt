
/** This file contains the customRoute2 function that moves the duck along a custom path. The path is defined by an SVG path data string. The function calculates the distances between points and normalizes them to values between 0 and 1. It then interpolates the duck's position based on the normalized distances and the local t value within each segment. The customRoute2 function is exported for use in the game loop.*/
import { parseSVGPath } from './convertSVGPath.js';

const canvas = document.getElementById('gameCanvas');

// Example SVG path data 
const pathData = "M 200 0 L 250 50 L 300 100 L 350 100 L 400 150 L 500 200 L 650 300 L 800 350 L 950 250 L 900 100 L 800 50 L 650 150 L 400 300 L 200 400 L 150 400 L 100 450 L 50 500 L 100 550 L 250 500 L 800 500 L 1000 350 ";

// Convert SVG path to coordinates
const customCoord2 = parseSVGPath(pathData);

// Calculate the distances between points
const distances = [];
for (let i = 0; i < customCoord2.length - 1; i++) {
    const dx = customCoord2[i + 1].x - customCoord2[i].x;
    const dy = customCoord2[i + 1].y - customCoord2[i].y;
    distances.push(Math.sqrt(dx * dx + dy * dy));
}

// Total path length
const totalLength = distances.reduce((acc, val) => acc + val, 0);

// Calculate normalized distances (0 to 1) for each point
const normalizedDistances = [0];
for (let i = 0; i < distances.length; i++) {
    normalizedDistances.push(normalizedDistances[i] + distances[i] / totalLength);
}

export const customRoute2 = (duck, t) => {
    // Find the segment in which t falls
    let segment = 0;
    while (t > normalizedDistances[segment + 1]) {
        segment++;
    }

    // Calculate local t within the segment
    const localT = (t - normalizedDistances[segment]) / (normalizedDistances[segment + 1] - normalizedDistances[segment]);

    // Interpolate position
    const start = customCoord2[segment];
    const end = customCoord2[segment + 1];
    duck.x = start.x + (end.x - start.x) * localT;
    duck.y = start.y + (end.y - start.y) * localT;
};

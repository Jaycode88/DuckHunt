import { parseSVGPath } from './convertSVGPath.js';

const canvas = document.getElementById('gameCanvas');

// Example SVG path data 
const pathData = "M 0 250 L 50 250 L 100 250 L 100 200 L 150 200 L 150 150 L 200 150 L 200 100 L 250 100 L 250 50 L 300 50 L 350 50 L 450 50 L 500 100 L 600 100 L 750 100 L 850 200 L 950 300 L 1000 350 L 1000 500 L 950 550 L 900 550 L 800 500 L 600 500 L 550 550 L 400 550 L 350 500 L 200 500 L 150 550 L 100 500 L 50 450 L 0 400 L 0 300 L 0 250 ";

// Convert SVG path to coordinates
const customCoord1 = parseSVGPath(pathData);

// Calculate the distances between points
const distances = [];
for (let i = 0; i < customCoord1.length - 1; i++) {
    const dx = customCoord1[i + 1].x - customCoord1[i].x;
    const dy = customCoord1[i + 1].y - customCoord1[i].y;
    distances.push(Math.sqrt(dx * dx + dy * dy));
}

// Total path length
const totalLength = distances.reduce((acc, val) => acc + val, 0);

// Calculate normalized distances (0 to 1) for each point
const normalizedDistances = [0];
for (let i = 0; i < distances.length; i++) {
    normalizedDistances.push(normalizedDistances[i] + distances[i] / totalLength);
}

export const customRoute1 = (duck, t) => {
    // Find the segment in which t falls
    let segment = 0;
    while (t > normalizedDistances[segment + 1]) {
        segment++;
    }

    // Calculate local t within the segment
    const localT = (t - normalizedDistances[segment]) / (normalizedDistances[segment + 1] - normalizedDistances[segment]);

    // Interpolate position
    const start = customCoord1[segment];
    const end = customCoord1[segment + 1];
    duck.x = start.x + (end.x - start.x) * localT;
    duck.y = start.y + (end.y - start.y) * localT;
};

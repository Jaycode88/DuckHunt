import { parseSVGPath } from './convertSVGPath.js';

const canvas = document.getElementById('gameCanvas');

// Example SVG path data 
const pathData = "M 0 550 L 200 0 L 450 150 L 600 50 L 1000 250 L 550 550 L 350 50 L 0 550 ";

// Convert SVG path to coordinates
const customCoord5 = parseSVGPath(pathData);

// Calculate the distances between points
const distances = [];
for (let i = 0; i < customCoord5.length - 1; i++) {
    const dx = customCoord5[i + 1].x - customCoord5[i].x;
    const dy = customCoord5[i + 1].y - customCoord5[i].y;
    distances.push(Math.sqrt(dx * dx + dy * dy));
}

// Total path length
const totalLength = distances.reduce((acc, val) => acc + val, 0);

// Calculate normalized distances (0 to 1) for each point
const normalizedDistances = [0];
for (let i = 0; i < distances.length; i++) {
    normalizedDistances.push(normalizedDistances[i] + distances[i] / totalLength);
}

export const customRoute5 = (duck, t) => {
    // Find the segment in which t falls
    let segment = 0;
    while (t > normalizedDistances[segment + 1]) {
        segment++;
    }

    // Calculate local t within the segment
    const localT = (t - normalizedDistances[segment]) / (normalizedDistances[segment + 1] - normalizedDistances[segment]);

    // Interpolate position
    const start = customCoord5[segment];
    const end = customCoord5[segment + 1];
    duck.x = start.x + (end.x - start.x) * localT;
    duck.y = start.y + (end.y - start.y) * localT;
};

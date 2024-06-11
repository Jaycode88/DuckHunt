import { parseSVGPath } from './convertSVGPath.js';

const canvas = document.getElementById('gameCanvas');

// Example SVG path data 
const pathData = "M 0 300 L 800 0 L 1000 300 L 150 0 L 900 550 L 1000 50 L 0 300 L 600 550 L 1000 300 ";

// Convert SVG path to coordinates
const customCoord6 = parseSVGPath(pathData);

// Calculate the distances between points
const distances = [];
for (let i = 0; i < customCoord6.length - 1; i++) {
    const dx = customCoord6[i + 1].x - customCoord6[i].x;
    const dy = customCoord6[i + 1].y - customCoord6[i].y;
    distances.push(Math.sqrt(dx * dx + dy * dy));
}

// Total path length
const totalLength = distances.reduce((acc, val) => acc + val, 0);

// Calculate normalized distances (0 to 1) for each point
const normalizedDistances = [0];
for (let i = 0; i < distances.length; i++) {
    normalizedDistances.push(normalizedDistances[i] + distances[i] / totalLength);
}

export const customRoute6 = (duck, t) => {
    // Find the segment in which t falls
    let segment = 0;
    while (t > normalizedDistances[segment + 1]) {
        segment++;
    }

    // Calculate local t within the segment
    const localT = (t - normalizedDistances[segment]) / (normalizedDistances[segment + 1] - normalizedDistances[segment]);

    // Interpolate position
    const start = customCoord6[segment];
    const end = customCoord6[segment + 1];
    duck.x = start.x + (end.x - start.x) * localT;
    duck.y = start.y + (end.y - start.y) * localT;
};

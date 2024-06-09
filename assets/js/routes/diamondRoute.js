const diamondCoords = [
    { x: 0, y: 260 },
    { x: 500, y: 0 },
    { x: 1000, y: 260 },
    { x: 500, y: 571 },
    { x: 0, y: 260 },
];

export const diamondRoute = (duck, t) => {
    const index = Math.floor(t * (diamondCoords.length - 1));
    const nextIndex = (index + 1) % diamondCoords.length;
    
    const start = diamondCoords[index];
    const end = diamondCoords[nextIndex];
    
    const progress = (t * (diamondCoords.length - 1)) % 1;
    
    duck.x = start.x + (end.x - start.x) * progress;
    duck.y = start.y + (end.y - start.y) * progress;
};
